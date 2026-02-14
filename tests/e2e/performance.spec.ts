import { test, expect } from "@playwright/test";
import { mockChatApi } from "./mock-api";

const MAX_TRANSITION_MS = 2000;
const MAX_AI_RENDER_MS = 2000;
/** 最初の1文字が表示されるまで（TTFB 相当）の許容時間 */
const MAX_TTFB_MS = 2000;

test.describe("パフォーマンス", () => {
  test("シーン切り替えが 2 秒以内に描画される", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByRole("button", { name: "← シーン" }).click();

    const start = Date.now();
    await page.getByTestId("scene-exec-report").click();
    await expect(page.getByTestId("scene-title")).toHaveText("Exec Report", {
      timeout: MAX_TRANSITION_MS,
    });
    await expect(
      page.getByText("Can you give us a quick update on the project")
    ).toBeVisible();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(MAX_TRANSITION_MS);
  });

  test("AI 回答エリアが 2 秒以内に描画される（モック応答）", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");

    const start = Date.now();
    await page.evaluate(async () => {
      const w = window as unknown as { __e2eTriggerChat?: (t: string) => Promise<void> };
      if (w.__e2eTriggerChat) await w.__e2eTriggerChat("test message");
    });
    await expect(page.getByTestId("refactored-block")).toBeVisible({
      timeout: MAX_AI_RENDER_MS,
    });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(MAX_AI_RENDER_MS);
  });

  test("TTFB: 最初の1文字が表示されるまでの時間が許容秒数以内", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");

    const ttfbStart = Date.now();
    await page.evaluate(async () => {
      const w = window as unknown as { __e2eTriggerChat?: (t: string) => Promise<void> };
      if (w.__e2eTriggerChat) await w.__e2eTriggerChat("ttfb test");
    });
    await expect(
      page.getByTestId("refactored-block").locator("p.text-emerald-100")
    ).toContainText(/./, { timeout: MAX_TTFB_MS });
    const ttfb = Date.now() - ttfbStart;

    expect(ttfb).toBeLessThan(MAX_TTFB_MS);

    if (ttfb > MAX_TTFB_MS * 0.8) {
      test.info().annotations.push({
        type: "warning",
        description: `TTFB が許容に近い値です: ${ttfb}ms (閾値 ${MAX_TTFB_MS}ms)`,
      });
    }
  });

  test("Performance API でナビゲーション時間を計測できる", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByRole("button", { name: "← シーン" }).click();

    await page.evaluate(() => {
      performance.mark("scene-switch-start");
    });
    await page.getByTestId("scene-morning-sync").click();
    await expect(page.getByTestId("scene-title")).toHaveText("Morning Sync");
    await page.evaluate(() => {
      performance.mark("scene-switch-end");
      performance.measure("scene-switch", "scene-switch-start", "scene-switch-end");
    });

    const measure = await page.evaluate(() => {
      const entries = performance.getEntriesByName("scene-switch", "measure");
      return entries.length > 0 ? entries[0].duration : -1;
    });
    expect(measure).toBeGreaterThanOrEqual(0);
    expect(measure).toBeLessThan(MAX_TRANSITION_MS);
  });
});
