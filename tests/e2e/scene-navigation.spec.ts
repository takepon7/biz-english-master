import { test, expect } from "@playwright/test";
import { mockChatApi } from "./mock-api";

test.describe("画面遷移", () => {
  test("採用面接から役員報告までシーンを切り替えてもエラーなく描画される", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByRole("button", { name: "← シーン" }).click();

    const sceneTitle = page.getByTestId("scene-title");
    await expect(sceneTitle).toHaveText("Job Interview");

    const sceneIds = [
      "first-team-intro",
      "morning-sync",
      "lunch-small-talk",
      "exec-report",
      "signing-off",
    ] as const;
    const sceneTitles = [
      "First Team Intro",
      "Morning Sync",
      "Lunch Small Talk",
      "Exec Report",
      "Signing Off",
    ];

    for (let i = 0; i < sceneIds.length; i++) {
      await page.getByTestId(`scene-${sceneIds[i]}`).click();
      await expect(sceneTitle).toHaveText(sceneTitles[i]);
      await expect(page.getByTestId("partner-line")).toBeVisible();
    }

    await expect(page.getByTestId("scene-title")).toHaveText("Signing Off");
  });

  test("サイドバーで Job Interview → Exec Report に切り替えられる", async ({
    page,
  }) => {
    await mockChatApi(page);
    await page.goto("/");
    await page.getByRole("button", { name: "← シーン" }).click();

    await expect(page.getByTestId("scene-title")).toHaveText("Job Interview");
    await page.getByTestId("scene-exec-report").click();
    await expect(page.getByTestId("scene-title")).toHaveText("Exec Report");
    await expect(
      page.getByText("Can you give us a quick update on the project")
    ).toBeVisible();
  });
});
