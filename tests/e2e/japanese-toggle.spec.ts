import { test, expect } from "@playwright/test";
import { mockChatApi, MOCK_CHAT_RESPONSE } from "./mock-api";

test.describe("日本語訳トグル", () => {
  test("OFF のとき日本語訳が表示されない", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");

    const jpSwitch = page.getByTestId("jp-toggle");
    await expect(jpSwitch).toHaveAttribute("aria-checked", "false");

    const partnerBlock = page.getByTestId("partner-line");
    await expect(partnerBlock).toContainText("Thanks for coming in");
    await expect(partnerBlock.getByTestId("partner-line-jp")).not.toBeVisible();
  });

  test("ON にするとオープニングの日本語訳が表示される", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");

    await page.getByTestId("jp-toggle").click();
    await expect(page.getByTestId("jp-toggle")).toHaveAttribute(
      "aria-checked",
      "true"
    );

    const partnerBlock = page.getByTestId("partner-line");
    await expect(partnerBlock.getByTestId("partner-line-jp")).toBeVisible();
    await expect(partnerBlock.getByTestId("partner-line-jp")).toContainText(
      "お越しくださいまして"
    );
  });

  test("ON → OFF で日本語訳が非表示になる", async ({ page }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByTestId("jp-toggle").click();
    await expect(page.getByTestId("partner-line-jp")).toBeVisible();

    await page.getByTestId("jp-toggle").click();
    await expect(page.getByTestId("jp-toggle")).toHaveAttribute(
      "aria-checked",
      "false"
    );
    await expect(page.getByTestId("partner-line-jp")).not.toBeVisible();
  });

  test("AI 応答後、トグル ON でリファクタ結果が表示される（API は3タグのため日本語訳は別途）", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");

    await page.getByTestId("jp-toggle").click();
    await page.evaluate(async () => {
      const w = window as unknown as { __e2eTriggerChat?: (t: string) => Promise<void> };
      if (w.__e2eTriggerChat) await w.__e2eTriggerChat("hello");
    });

    await expect(page.getByTestId("refactored-block")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("refactored-block")).toContainText(
      MOCK_CHAT_RESPONSE.refactoredEnglish
    );
  });
});
