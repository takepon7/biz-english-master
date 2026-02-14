This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## TTS（音声読み上げ）の動作確認チェックリスト

実機・ブラウザで次の3点を確認してください。

### 1. スマホでの動作（iPhone / Android）

- **マナーモードを解除**した状態で、Refactored English のスピーカーアイコンをタップする。
- **iPhone**: サイレントスイッチをオフにし、メディア音量を上げておく。Safari で開いてタップ再生を試す。
- **Android**: メディア音量を上げ、Chrome 等で開いてタップ再生を試す。
- ユーザー操作（タップ）に紐づいて再生するため、多くの環境で音声が許可される想定です。出ない場合は端末の「メディア」音量とブラウザの権限を確認してください。

### 2. ストリーミングとの兼ね合い

- AI の回答が「シュバババッ」と表示されている**途中**でスピーカーボタンを押す。
- **期待動作**: その時点まで届いている Refactored English のテキストだけが読み上げられる。途中で押した場合は途中までの文が読まれる。
- 再生中に再度ボタンを押すと、一度停止してから新しい内容で最初から再生し直す。

### 3. 人事視点（読み上げ内容）

- 読み上げられるのは **Refactored English（練習すべきフレーズ）のみ**です。
- **Coaching Note（厳しいフィードバック・コーチングメモ）は読み上げません。** 画面上もスピーカーアイコンは「プロの英語」ブロックにのみ付いており、コーチングメモには付いていません。
