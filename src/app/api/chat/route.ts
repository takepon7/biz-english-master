import { GoogleGenAI } from "@google/genai";
import { DELIMITERS } from "@/lib/chatDelimiters";
import { getIsProByEmail } from "@/lib/auth";

console.log("★API KEY CHECK:", process.env.GEMINI_API_KEY ? "読み込み成功" : "読み込み失敗");
export const runtime = "edge";

const MODEL = "gemini-2.5-flash";

/** シーン別コンテキスト（相手の役職・性格を含む） */
const SCENE_CONFIG: Record<
  string,
  { context: string; behaviorFocus: string; partnerRole: string; partnerPersonality: string }
> = {
  "coffee-break": {
    context:
      "The Coffee Break: User runs into a colleague at the pantry. Casual small talk, 2–3 minutes, not work-heavy. Build rapport.",
    behaviorFocus: "Natural small talk: not too stiff, not too casual. Suggest follow-up questions or brief self-disclosure.",
    partnerRole: "Peer (colleague)",
    partnerPersonality: "Friendly",
  },
  "clarifying-instructions": {
    context:
      "Clarifying Instructions: The boss gave vague instructions. User must ask what exactly to do without sounding rude or incompetent.",
    behaviorFocus: "Polite clarification: specific questions, not 'I don't understand.' E.g. deadline, scope, format.",
    partnerRole: "Boss",
    partnerPersonality: "Busy",
  },
  "tech-support-request": {
    context:
      "Tech Support Request: User has a PC/setup issue. They write a short chat message to IT: clear problem description and ask for help.",
    behaviorFocus: "Clear, concise: what's wrong, what they tried, what they need. No rambling.",
    partnerRole: "Peer (IT support)",
    partnerPersonality: "Busy",
  },
  "meeting-the-team": {
    context:
      "Meeting the Team: First day. User gives a short self-intro to the team: who they are, what they'll work on, maybe one personal touch.",
    behaviorFocus: "Brief and memorable. Not too long; balance professional and approachable.",
    partnerRole: "Peer (team lead)",
    partnerPersonality: "Friendly",
  },
  "pushing-back": {
    context:
      "Pushing Back: Someone requested an unrealistic deadline. User says no without burning bridges: offer an alternative (e.g. partial delivery, different date).",
    behaviorFocus: "Negotiation: acknowledge the ask, state constraints, propose a concrete alternative. No blunt 'No.'",
    partnerRole: "Boss",
    partnerPersonality: "Short-tempered",
  },
  "speaking-up": {
    context:
      "Speaking Up: In a meeting, the flow is going one way. User wants to interject and share a different view ('Can I add something?') and state it clearly.",
    behaviorFocus: "Polite interruption and clear point. Not aggressive; signal before speaking.",
    partnerRole: "Boss / mixed",
    partnerPersonality: "Busy",
  },
  "reporting-bad-news": {
    context:
      "Reporting Bad News: User made a mistake or will miss a deadline. They report to the boss: facts only, no excuses, and suggest a recovery plan.",
    behaviorFocus: "Fact-based, accountable, solution-oriented. No over-apologizing or vagueness.",
    partnerRole: "Boss",
    partnerPersonality: "Short-tempered",
  },
  "daily-standup": {
    context:
      "Daily Standup: Short update—what I did yesterday, what I'm doing today, any blockers. Keep it brief.",
    behaviorFocus: "Brevity and clarity. One sentence per item; clear ask if blocked.",
    partnerRole: "Peer (scrum lead) / Boss",
    partnerPersonality: "Busy",
  },
  "asking-for-feedback": {
    context:
      "Asking for Feedback: In a 1on1, user asks the boss for feedback and improvement points. Draw out concrete, actionable comments.",
    behaviorFocus: "Open questions that invite specific feedback. E.g. 'What could I do better on X?'",
    partnerRole: "Boss",
    partnerPersonality: "Friendly",
  },
  "disagreeing-politely": {
    context:
      "Disagreeing Politely: The team decided on a direction. User has a different concern. They disagree without being confrontational and state reasons.",
    behaviorFocus: "Logical, calm. 'I have a concern about...' or 'Another angle could be...' Not emotional.",
    partnerRole: "Boss / Peer",
    partnerPersonality: "Short-tempered",
  },
  "goal-setting-talk": {
    context:
      "Goal Setting Talk: 1on1 to align on next quarter's goals. User states what they want to focus on and where they need support.",
    behaviorFocus: "Clear goals and ask for support. Balance ambition and realism.",
    partnerRole: "Boss",
    partnerPersonality: "Busy",
  },
  "networking-lunch": {
    context:
      "Networking Lunch: Lunch with a senior colleague. Casual but professional; user asks about how things work, culture, or career advice.",
    behaviorFocus: "Genuine questions, light self-disclosure. Not too formal; build relationship.",
    partnerRole: "Peer (senior)",
    partnerPersonality: "Friendly",
  },
};

const BASE_SYSTEM_PROMPT = `You are a business English coach and HR communication expert. Output ONLY the following four blocks in this exact order. No greeting, no preamble, no explanation, no markdown. Start immediately with the first tag.

${DELIMITERS.NEXT}
(One block: your reply as the role-play partner, 1–2 sentences, continuing the scenario. Output this first so the user sees the response immediately.)

${DELIMITERS.TRANSLATION}
(One block, required for every turn: the Japanese translation of the ${DELIMITERS.NEXT} content above. 必ず出力すること。)

${DELIMITERS.REFACTORED}
(One block: rewrite the user's utterance into natural, situation-appropriate business English. Same intent, similar length.)

${DELIMITERS.ANALYSIS}
(One block, in Japanese only. (1) 現状の評価: ユーザーの英語は文法的に正しかったか？意図は通じるか？（例：「文法は完璧ですが、少しカジュアルすぎます」）。 (2) 修正のポイント: なぜ Refactored English のような表現に変えたのか？（例：「want to よりも would like to の方が、役員相手には適切だからです」）。HR観点の一言メモも含めてよい。)

Rules: Do not output anything before ${DELIMITERS.NEXT}. Do not output anything after the ${DELIMITERS.ANALYSIS} content. Output ${DELIMITERS.TRANSLATION} in every turn without exception. No "Sure.", "Here is.", or similar. Only the four tags and their content.`;

/** 企業文化ごとの添削基準（システムプロンプトに追加） */
const CULTURE_PROMPT: Record<string, string> = {
  "tech-startup": `Company culture: Tech Startup (West Coast Style). Tone: Casual, Direct, Fast-paced. Correction rules: Do NOT suggest "Sir/Madam" or overly formal titles; recommend BLUF (Bottom Line Up Front). Slang and abbreviations (ASAP, FYI, etc.) are acceptable. Prefer concise, action-oriented phrasing.`,
  "traditional-corporate": `Company culture: Traditional Corporate (Conservative). Tone: Formal, Polite, Indirect. Correction rules: Enforce polite forms (Could you, Would you, I would appreciate). Prefer risk-averse, hedging language where appropriate. Avoid overly casual or blunt phrasing.`,
  "global-team": `Company culture: Global Team (Non-Native Friendly). Tone: Simple, Clear, Slow. Correction rules: Avoid difficult idioms (e.g. "rain check", "piece of cake"). Recommend "Global English"—plain vocabulary and straightforward sentence structure that anyone can understand. Prefer short sentences and clear logic.`,
};

function buildSystemPrompt(scene: string, companyCulture?: string): string {
  const config = SCENE_CONFIG[scene];
  let prompt = BASE_SYSTEM_PROMPT;
  if (config) {
    prompt += `

Current scenario: ${config.context}
Partner role (play this character): ${config.partnerRole}
Partner personality: ${config.partnerPersonality}
Coaching focus: ${config.behaviorFocus}`;
  }
  if (companyCulture && CULTURE_PROMPT[companyCulture]) {
    prompt += `

${CULTURE_PROMPT[companyCulture]}`;
  }
  return prompt;
}

export interface ChatRequestBody {
  scene: string;
  userMessage: string;
  history?: { role: "user" | "partner"; text: string }[];
  companyCulture?: string;
  /** 機能制限のバイパス用。ADMIN_EMAIL と一致する場合は isPro として制限なし */
  userEmail?: string | null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { scene, userMessage, history = [], companyCulture, userEmail } = body;
  if (!userMessage?.trim()) {
    return new Response(JSON.stringify({ error: "userMessage is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isPro = getIsProByEmail(userEmail);
  // 今後の「1日5回まで」等の制限: if (!isPro && overDailyLimit()) return 429;

  const sceneConfig = SCENE_CONFIG[scene];
  const sceneContext = sceneConfig
    ? `${sceneConfig.context}\n\nPartner: ${sceneConfig.partnerRole}, ${sceneConfig.partnerPersonality}.\n\nCoaching: ${sceneConfig.behaviorFocus}`
    : "Business conversation.";
  const historyText =
    history.length > 0
      ? history
          .map((h) => `${h.role === "user" ? "User" : "Partner"}: ${h.text}`)
          .join("\n") + "\n\n"
      : "";

  const userPrompt = `${sceneContext}

${historyText}User (refactor and respond): "${userMessage.trim()}"

Output only ${DELIMITERS.NEXT}, then ${DELIMITERS.TRANSLATION}, then ${DELIMITERS.REFACTORED}, then ${DELIMITERS.ANALYSIS} with their content. [TRANSLATION] is required every time. Nothing else.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = buildSystemPrompt(scene, companyCulture);
    const contentsWithSystem = `${systemPrompt}\n\n---\n\n${userPrompt}`;
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: contentsWithSystem,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: "Chat request failed", detail: message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
