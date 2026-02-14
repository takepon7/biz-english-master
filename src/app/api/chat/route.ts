import { GoogleGenAI } from "@google/genai";
import { DELIMITERS } from "@/lib/chatDelimiters";

export const runtime = "edge";

const MODEL = "gemini-1.5-flash";

/** シーン別コンテキスト */
const SCENE_CONFIG: Record<
  string,
  { context: string; behaviorFocus: string }
> = {
  "job-interview": {
    context:
      "Job Interview: The user is in a hiring interview. The partner is an interviewer. Tone: professional, concise, evidence-based.",
    behaviorFocus:
      "Comment on both language and behavior: e.g. too vague, not enough concrete examples, or too humble.",
  },
  "first-team-intro": {
    context:
      "First Team Intro: The user is introducing themselves to the team. Tone: warm but professional, concise, approachable.",
    behaviorFocus:
      "Note if they are too formal or too casual. Balance between memorable and professional.",
  },
  "morning-sync": {
    context:
      "Morning Sync: A short daily standup. Tone: brief, clear, action-oriented.",
    behaviorFocus:
      "Comment on clarity and brevity: e.g. too long, missing a clear ask.",
  },
  "lunch-small-talk": {
    context:
      "Lunch Small Talk: Casual conversation with a colleague. Tone: relaxed, friendly, work-appropriate.",
    behaviorFocus:
      "Suggest slightly more relaxed vocabulary if appropriate. Note if too stiff or too informal.",
  },
  "exec-report": {
    context:
      "Exec Report: Progress update to executives. Tone: concise, outcome-focused, confident. No long preambles.",
    behaviorFocus:
      "Comment on structure: e.g. preamble too long, need a clear bottom line first.",
  },
  "signing-off": {
    context:
      "Signing Off: End-of-day greetings. Tone: brief, polite, clear about handoffs if any.",
    behaviorFocus:
      "Note if the sign-off is clear and professional without being cold.",
  },
};

const BASE_SYSTEM_PROMPT = `You are a business English coach and HR communication expert. Output ONLY the following three blocks in order. No greeting, no preamble, no explanation, no markdown. Start immediately with the first tag.

${DELIMITERS.REFACTORED}
(One block: rewrite the user's utterance into natural, situation-appropriate business English. Same intent, similar length.)

${DELIMITERS.NOTE}
(One block: one or two short sentences from an HR perspective—why this wording works and any behavior/tone note for the scenario.)

${DELIMITERS.NEXT}
(One block: your reply as the role-play partner, 1–2 sentences, continuing the scenario.)

Rules: Do not output anything before ${DELIMITERS.REFACTORED}. Do not output anything after the ${DELIMITERS.NEXT} content. No "Sure.", "Here is.", or similar. Only the three tags and their content.`;

function buildSystemPrompt(scene: string): string {
  const config = SCENE_CONFIG[scene];
  if (!config) return BASE_SYSTEM_PROMPT;
  return `${BASE_SYSTEM_PROMPT}

Current scenario: ${config.context}
Coaching focus: ${config.behaviorFocus}`;
}

export interface ChatRequestBody {
  scene: string;
  userMessage: string;
  history?: { role: "user" | "partner"; text: string }[];
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

  const { scene, userMessage, history = [] } = body;
  if (!userMessage?.trim()) {
    return new Response(JSON.stringify({ error: "userMessage is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sceneConfig = SCENE_CONFIG[scene];
  const sceneContext = sceneConfig
    ? `${sceneConfig.context}\n\nCoaching: ${sceneConfig.behaviorFocus}`
    : "Business conversation.";
  const historyText =
    history.length > 0
      ? history
          .map((h) => `${h.role === "user" ? "User" : "Partner"}: ${h.text}`)
          .join("\n") + "\n\n"
      : "";

  const userPrompt = `${sceneContext}

${historyText}User (refactor and respond): "${userMessage.trim()}"

Output only ${DELIMITERS.REFACTORED}, then ${DELIMITERS.NOTE}, then ${DELIMITERS.NEXT} with their content. Nothing else.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = buildSystemPrompt(scene);
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      systemInstruction: systemPrompt,
      contents: userPrompt,
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
