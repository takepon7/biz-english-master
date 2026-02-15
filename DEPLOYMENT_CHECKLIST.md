# GitHub プッシュ・Vercel デプロイ 最終確認チェックリスト

## 1. PWA 設定 ✅

| 項目 | 場所 | 状態 |
|------|------|------|
| `display: "standalone"` | `public/manifest.json` | ✅ 設定済み |
| `theme_color` / `background_color` | `public/manifest.json` | ✅ `#0f172a`（スプラッシュ・ステータスバー） |
| iOS メタタグ | `src/app/layout.tsx` | ✅ `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` |
| viewport `themeColor` | `src/app/layout.tsx` | ✅ `#0f172a` |
| アイコン（PWA / Apple） | `layout.tsx` metadata.icons | ✅ icon-192/512, apple-touch-icon 参照 |
| next-pwa | `next.config.ts` | ✅ `@ducanh2912/next-pwa`, dest: public, dev 時 disable |
| ホーム画面追加の誘導 | `AddToHomeScreenBanner.tsx` + practice Settings 文言 | ✅ 実装済み |

**注意**: `public/icon-192x192.png`, `public/icon-512x512.png`, `public/apple-touch-icon.png` を配置するとアイコンが正しく表示されます。未配置の場合は PWA インストール時にデフォルトアイコンになります。

---

## 2. API 制限（1日あたりチャット回数） ✅

| 項目 | 場所 | 状態 |
|------|------|------|
| 無料ユーザー上限 | `src/lib/dailyLimit.ts` | ✅ `DAILY_CHAT_LIMIT = 5` |
| 日付の扱い | `getTodayString()` | ✅ JST (Asia/Tokyo) |
| チャット API での適用 | `src/app/api/chat/route.ts` | ✅ 認証後・isPro 判定後、Clerk privateMetadata でカウント・429 返却 |
| Pro ユーザー | 制限スキップ | ✅ `getIsProForUser(user)` が true の場合は制限なし |

---

## 3. Stripe 連携 ✅

| 項目 | 場所 | 状態 |
|------|------|------|
| Checkout（課金開始） | `src/app/api/stripe/checkout/route.ts` | ✅ POST, client_reference_id=userId, success/cancel URL |
| Customer Portal（解約・支払い方法変更） | `src/app/api/stripe/portal/route.ts` | ✅ POST, return_url で /practice に戻る |
| Webhook（サブスク状態同期） | `src/app/api/stripe/webhook/route.ts` | ✅ 署名検証, checkout.session.completed / customer.subscription.updated|deleted → Clerk publicMetadata 更新 |
| Pro 判定 | `src/lib/auth.ts` | ✅ ADMIN_EMAIL または stripeSubscriptionStatus === 'active' |
| Pro 状態 API | `src/app/api/pro-status/route.ts` | ✅ GET, isPro / canManageSubscription 返却 |

**Vercel 環境変数（必須）**  
- `GEMINI_API_KEY`  
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`  
- `ADMIN_EMAIL`（任意・Pro 扱いしたいメール）  
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID`  

**オプション**  
- `NEXT_PUBLIC_APP_URL`: 本番 URL（例: `https://your-app.vercel.app`）。未設定時は Vercel の `VERCEL_URL` が使われます。Stripe の success/cancel URL に使用。

**Stripe 本番時**  
- Dashboard の Webhook に「本番の URL + /api/stripe/webhook」を登録し、`STRIPE_WEBHOOK_SECRET` を本番用に差し替える。  
- Checkout / Price は本番用 ID（price_xxx）に変更。

---

## 4. その他（今回の修正）

- **プロダクトキャプチャ画像**: クリックで GitHub へ遷移せず、その場でライトボックス表示。
  - `src/components/ImageLightbox.tsx`: モーダル・ライトボックスコンポーネント。
  - `src/app/page.tsx`: キャプチャ用の画像リスト + クリックでライトボックス表示。`public/screenshots/` に画像を置き、`PRODUCT_SCREENSHOTS` に追加すると複数枚表示可能。

---

## 5. プッシュ・デプロイ手順

1. 必要な環境変数を Vercel プロジェクトに設定（上記参照）。
2. `git add .` → `git commit -m "..."` → `git push origin main`（または使用ブランチ）。
3. Vercel が自動ビルド・デプロイ。Stripe Webhook は本番 URL で再登録・本番用シークレットに更新。

以上で、PWA・API 制限・Stripe を含む最終確認は完了です。
