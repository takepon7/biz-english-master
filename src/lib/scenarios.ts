/**
 * 外資系入社〜定着までの 12 マイクロ・シチュエーション（キャリア・タイムライン）
 */

export type SceneId =
  | "coffee-break"
  | "clarifying-instructions"
  | "tech-support-request"
  | "meeting-the-team"
  | "pushing-back"
  | "speaking-up"
  | "reporting-bad-news"
  | "daily-standup"
  | "asking-for-feedback"
  | "disagreeing-politely"
  | "goal-setting-talk"
  | "networking-lunch";

export interface ScenarioItem {
  id: SceneId;
  label: string;
  sublabel: string;
}

/** カテゴリA: 入社・オンボーディング（Day 1 - Week 1） */
const CATEGORY_A: ScenarioItem[] = [
  { id: "coffee-break", label: "The Coffee Break", sublabel: "パントリーで同僚と雑談" },
  { id: "clarifying-instructions", label: "Clarifying Instructions", sublabel: "曖昧な指示を聞き返す" },
  { id: "tech-support-request", label: "Tech Support Request", sublabel: "IT に設定トラブルを依頼" },
  { id: "meeting-the-team", label: "Meeting the Team", sublabel: "初日・チームに自己紹介" },
];

/** カテゴリB: 実務・信頼構築（Month 1） */
const CATEGORY_B: ScenarioItem[] = [
  { id: "pushing-back", label: "Pushing Back", sublabel: "無理な納期に代案で調整" },
  { id: "speaking-up", label: "Speaking Up", sublabel: "会議で意見を割り込んで言う" },
  { id: "reporting-bad-news", label: "Reporting Bad News", sublabel: "ミス・遅延を事実ベースで報告" },
  { id: "daily-standup", label: "Daily Standup", sublabel: "朝の進捗共有" },
];

/** カテゴリC: 文化・評価（Month 3） */
const CATEGORY_C: ScenarioItem[] = [
  { id: "asking-for-feedback", label: "Asking for Feedback", sublabel: "1on1 で評価・改善点を聞く" },
  { id: "disagreeing-politely", label: "Disagreeing Politely", sublabel: "方針に懸念を論理的に伝える" },
  { id: "goal-setting-talk", label: "Goal Setting Talk", sublabel: "目標設定の 1on1" },
  { id: "networking-lunch", label: "Networking Lunch", sublabel: "先輩とのランチで関係構築" },
];

export const TIMELINE_CATEGORIES = [
  { phase: "Day 1 - Week 1", label: "入社・オンボーディング", scenarios: CATEGORY_A },
  { phase: "Month 1", label: "実務・信頼構築", scenarios: CATEGORY_B },
  { phase: "Month 3", label: "文化・評価", scenarios: CATEGORY_C },
] as const;

export const ALL_SCENARIO_IDS: SceneId[] = [
  ...CATEGORY_A.map((s) => s.id),
  ...CATEGORY_B.map((s) => s.id),
  ...CATEGORY_C.map((s) => s.id),
];

const LABELS: Record<SceneId, string> = Object.fromEntries(
  [...CATEGORY_A, ...CATEGORY_B, ...CATEGORY_C].map((s) => [s.id, s.label])
) as Record<SceneId, string>;

const SUBLABELS: Record<SceneId, string> = Object.fromEntries(
  [...CATEGORY_A, ...CATEGORY_B, ...CATEGORY_C].map((s) => [s.id, s.sublabel])
) as Record<SceneId, string>;

export function getScenarioLabel(scenarioId: string): string {
  return LABELS[scenarioId as SceneId] ?? scenarioId;
}

export function getScenarioSublabel(scenarioId: string): string {
  return SUBLABELS[scenarioId as SceneId] ?? scenarioId;
}

/** オープニング台詞（相手の一言）英語 */
export const SCENE_OPENING: Record<SceneId, string> = {
  "coffee-break": "Hey! You're the new hire, right? I'm Alex from Marketing. Getting used to the place?",
  "clarifying-instructions": "I need you to look into the Q3 numbers and get back to me when you can. Any questions?",
  "tech-support-request": "[Chat] Hi, this is IT Support. How can I help you today?",
  "meeting-the-team": "Hey everyone, this is our new teammate. Why don't you give us a quick intro—what you'll be doing and a bit about yourself?",
  "pushing-back": "We need the full report by Friday. I know it's tight, but the client moved the deadline. Can you do it?",
  "speaking-up": "So we're going with Option A for the launch. Unless anyone has a strong objection, we'll lock it in.",
  "reporting-bad-news": "You wanted to talk? Close the door. What's going on?",
  "daily-standup": "Good morning. Let's go around—what did you do yesterday, what's today, any blockers?",
  "asking-for-feedback": "Good to see you. So, how do you think your first few months have gone? Anything you want to ask me?",
  "disagreeing-politely": "The team has decided to prioritize the US market first. We'll revisit APAC in Q2. Any thoughts?",
  "goal-setting-talk": "Let's align on your goals for the next quarter. What do you want to focus on, and where do you need support?",
  "networking-lunch": "So glad you could join! I've been here five years—if you have any questions about how things work, just ask.",
};

/** オープニング台詞（相手の一言）日本語 */
export const SCENE_OPENING_JP: Record<SceneId, string> = {
  "coffee-break": "やあ、新人さんだよね？マーケのアレックス。もう慣れてきた？",
  "clarifying-instructions": "Q3の数字を調べて、できるときに戻ってきて。質問ある？",
  "tech-support-request": "[チャット] こんにちは、ITサポートです。どのようなご用件でしょうか？",
  "meeting-the-team": "みんな、新しいメンバーだよ。簡単に自己紹介して—何を担当するかと、自分について少し。",
  "pushing-back": "金曜までにレポート全部必要で。厳しいのは分かってるけど、クライアントが締め切り繰り上げたんだ。できる？",
  "speaking-up": "じゃあローンチはオプションAで進めよう。強い反対がなければそこで確定。",
  "reporting-bad-news": "話があるんだったな。ドア閉めて。どうした？",
  "daily-standup": "おはよう。順番に—昨日何した、今日何する、ブロッカーある？",
  "asking-for-feedback": "会えてよかった。で、最初の数ヶ月どうだったと思う？何か聞きたいことある？",
  "disagreeing-politely": "チームではまず米国市場を優先することを決めた。APACはQ2で見直す。意見ある？",
  "goal-setting-talk": "次の四半期の目標を合わせよう。何に集中したい？どこでサポートが必要？",
  "networking-lunch": "来てくれてありがとう！ここで5年なの。やり方で質問あったら何でも聞いてね。",
};
