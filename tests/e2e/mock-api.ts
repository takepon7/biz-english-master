import type { Route } from "@playwright/test";

const DELIMITERS = {
  REFACTORED: "[REFACTORED]",
  NOTE: "[NOTE]",
  NEXT: "[NEXT]",
} as const;

/**
 * テスト用モックレスポンス（3タグ形式・API と同一）
 */
export const MOCK_CHAT_RESPONSE = {
  refactoredEnglish:
    "Thank you for the opportunity. I'd like to walk you through my background and why I'm excited about this role.",
  coachingNote:
    "More concise and confident. Avoid filler; lead with gratitude and structure.",
  nextDialogue:
    "That sounds like a strong fit. Can you give me one example of a time you led a project under pressure?",
  japanese_translation: {
    refactored: "",
    nextDialogue: "",
  },
};

/** デリミタ形式の1チャンク body（[REFACTORED][NOTE][NEXT] のみ） */
export function mockChatStreamBody(overrides: Partial<typeof MOCK_CHAT_RESPONSE> = {}): string {
  const r = { ...MOCK_CHAT_RESPONSE, ...overrides };
  return [
    DELIMITERS.REFACTORED,
    r.refactoredEnglish,
    DELIMITERS.NOTE,
    r.coachingNote,
    DELIMITERS.NEXT,
    r.nextDialogue,
  ].join("\n");
}

/**
 * /api/chat をモック（ストリーム形式で返す）
 */
export async function mockChatApi(
  page: { route: (url: string | RegExp, handler: (route: Route) => Promise<void>) => Promise<void> },
  overrides: Partial<typeof MOCK_CHAT_RESPONSE> = {}
) {
  const body = mockChatStreamBody(overrides);
  await page.route("**/api/chat", async (route: Route) => {
    const request = route.request();
    if (request.method() !== "POST") return route.continue();
    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body,
    });
  });
}
