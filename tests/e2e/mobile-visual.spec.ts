import { test, expect } from "@playwright/test";
import { mockChatApi } from "./mock-api";

/**
 * モバイルビューでのタップしやすさ・テキストはみ出しの確認（ビジュアル回帰の準備）
 * 実際のスクリーンショット比較は toHaveScreenshot で拡張可能
 */
test.describe("モバイルビジュアル・タップ領域", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("マイクボタンが十分なタップ領域を持つ（44px 以上）", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");

    const micButton = page.getByRole("button", {
      name: /Start voice input|Stop listening/,
    });
    await expect(micButton).toBeVisible();

    const box = await micButton.boundingBox();
    expect(box).toBeTruthy();
    const minTouchTarget = 44;
    expect(box!.width).toBeGreaterThanOrEqual(minTouchTarget);
    expect(box!.height).toBeGreaterThanOrEqual(minTouchTarget);
  });

  test("日本語訳トグルがタップ可能なサイズである", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");

    const jpSwitch = page.getByTestId("jp-toggle");
    await expect(jpSwitch).toBeVisible();
    const box = await jpSwitch.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test("シーン選択ボタンが画面内に収まりはみ出していない", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByRole("button", { name: "← シーン" }).click();

    const sidebar = page.locator("aside").first();
    await expect(sidebar).toBeVisible();

    const execButton = page.getByTestId("scene-exec-report");
    await expect(execButton).toBeVisible();
    const box = await execButton.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
  });

  test("相手のセリフエリアでテキストが読み取れる", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");

    const partnerLine = page.getByTestId("partner-line");
    await expect(partnerLine).toBeVisible();
    await expect(partnerLine).toContainText("Thanks for coming in");
    const box = await partnerLine.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
  });
});
