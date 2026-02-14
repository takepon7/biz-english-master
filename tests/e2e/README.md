# E2E テスト（Playwright）

## 実行方法

```bash
npm run test:e2e          # 全プロジェクト（Chromium + モバイル）
npm run test:e2e:ui       # UI モードで実行
npx playwright test --project=chromium   # Chromium のみ
```

初回は `npx playwright install` でブラウザをインストールしてください。

## モック戦略

- **`/api/chat`** を `tests/e2e/mock-api.ts` の `mockChatApi(page)` でモックし、Gemini API を叩かずに固定レスポンスを返します。
- 各 spec で `await mockChatApi(page)` を呼ぶと、そのページでは実際の API が使われません。

## テスト構成

| ファイル | 内容 |
|----------|------|
| `scene-navigation.spec.ts` | シーン切り替え（採用面接→役員報告など）でエラーなく描画されるか |
| `japanese-toggle.spec.ts` | 日本語訳トグルの ON/OFF で表示・非表示が切り替わるか |
| `performance.spec.ts` | シーン遷移・AI 回答エリアが 2 秒以内に描画されるか（Performance API 利用） |
| `mobile-visual.spec.ts` | モバイルビューでタップ領域・テキストはみ出しの確認（ビジュアル回帰の準備） |

## ビジュアル回帰の拡張

スクリーンショット比較を有効にする例:

```ts
await expect(page.getByTestId("partner-line")).toHaveScreenshot("partner-line-mobile.png");
```

初回実行でベースラインが保存され、以降は差分で失敗します。`playwright.config.ts` で `expect.toHaveScreenshot` の閾値調整が可能です。
