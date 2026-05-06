# biz-english-master 改善計画書

連休明けから着手する 3つの改善ポイントを優先順に整理。

---

## 全体スケジュール

| Week | 期間 | 主な作業 | 想定工数 |
|------|------|----------|----------|
| Week 1 | 5/7-5/13 | 音声バグ修正 + 反復練習の価値化 | 6-12時間 |
| Week 2 | 5/14-5/20 | Persona 追加 + ユーザーテスト | 8-16時間 |
| Week 3+ | 5/21〜 | フィードバック駆動の改善 | 継続的 |

## 前提状況 (連休5日目時点)

```
✅ Stripe 本番審査通過
✅ 独自ドメイン (biz-english-master.com)
✅ Clerk Production 移行完了
✅ Google OAuth Production
✅ 法的ページ3種公開
✅ 本番モードでの実決済確認済み

🔴 改善ポイント:
1. 音声 1回目だけ掠れる (バグ)
2. コンテンツ 12シナリオは少なめ (UX 改善必要)
3. 企業文化選択肢の見直し (要顧客検証)
```

---

# Task 1.1: 音声バグの調査・修正

## 緊急度
🔴 **高** (本番運用前に必須、ユーザー体験に直結)

## 仮説 (優先順)

### 仮説A: TTS API のコールドスタート (最有力)
```
Azure TTS Free Tier や類似の TTS API は、
バックエンドのコンテナがコールドスタートする際、
最初の数バイトの音声データが欠損する可能性。

「2回目以降は正常」というパターンと完全一致。
```

### 仮説B: 音声データのストリーミング不完全
```
1回目: 音声データの一部だけで再生開始 → 掠れる
2回目: ブラウザキャッシュから完全データ再生 → 正常
```

### 仮説C: ブラウザの autoplay policy
```
最近のブラウザは「ユーザーインタラクション後にしか音声再生できない」。
1回目は厳密チェック、2回目はキャッシュで通る可能性。
```

### 仮説D: TTS 自体の最初の音素欠損
```
TTS エンジンによっては、最初の数 ms が無音 or ノイズになる。
2回目以降はキャッシュされた完全な音声が再生される。
```

## 調査計画

### Step 1: 現象の再現条件を絞る (10分)

確認すること:
- 同じシナリオの1回目だけ?
- 全シナリオの1回目?
- ブラウザを変えると?
- ページ再読み込み後の1回目だけ?
- 異なるユーザーで同様?

### Step 2: ネットワークタブで観察 (10分)

```
F12 → Network → Media フィルター
1回目と2回目の音声リクエストを比較:
- ステータスコード (200 OK?)
- レスポンスサイズ (1回目と2回目で違う?)
- レスポンス時間 (1回目だけ極端に遅い? = コールドスタート)
- Content-Type (audio/mpeg or audio/wav?)
```

### Step 3: コンソールログ追加 (Claude Code で 30分)

実装:
```typescript
// TTS 呼び出し前後にログ追加
console.time('tts-request');
const audioBlob = await fetchTTS(text);
console.timeEnd('tts-request');
console.log('audio size:', audioBlob.size);
```

## 修正パターン (仮説別)

### 仮説A 対応: TTS の事前ウォームアップ

```typescript
// /practice ページに到達したらすぐウォームアップ
useEffect(() => {
  // 短いダミーテキストで TTS API を起動させる
  fetchTTS(' ').catch(() => {
    // ウォームアップ失敗は無視 (本番リクエストで再試行される)
  });
}, []);
```

または、アプリ起動時に backend の専用 API を叩く:
```typescript
// /api/tts/warmup を叩いて backend を起こす
fetch('/api/tts/warmup', { method: 'POST' });
```

### 仮説B 対応: 完全ダウンロード待ってから再生

```typescript
const audio = new Audio(url);
audio.preload = 'auto';
audio.addEventListener('canplaythrough', () => {
  audio.play();
}, { once: true });
```

### 仮説C 対応: AudioContext の事前初期化

```typescript
// ユーザーの初回操作時に AudioContext を起動
const handleFirstInteraction = () => {
  const audioContext = new AudioContext();
  audioContext.resume();
  document.removeEventListener('click', handleFirstInteraction);
};
document.addEventListener('click', handleFirstInteraction, { once: true });
```

### 仮説D 対応: 短い無音を最初に追加

```typescript
// TTS の出力前に 100ms の無音を入れて、起動部分を犠牲にする
const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAQAAAAAAAAAAnEKwOj4AAAAAAAAAAAAAAAA=');
silentAudio.play();
```

## 推奨対応

**仮説A (コールドスタート) を最初に試す**

修正コスト: ウォームアップ実装に 30分〜1時間
効果予測: 90% の確率で改善

実装手順:
1. /practice ページの useEffect 内でダミー TTS リクエスト
2. デプロイ
3. 5回連続でテストして1回目から正常か確認

---

# Task 1.2: コンテンツ反復練習の価値化

## 背景

```
現状: day1 + Month1 + Month2 + Month3 = 各 4 シナリオ × 4 ステージ = 12 シナリオ
1シナリオ = 5-10 ターン × 5-15 分

ユーザーが全 12 シナリオを 1周するのに 1-3時間。
週3回練習すると 1ヶ月以内に全部終わる。
```

問題:
- 7日トライアル中に全部終わる可能性 → 解約リスク
- 「12シナリオに月3000円」の不満感

## 解決策

「1周したら終わり」ではなく「**マスターするのが目標**」という設計に変える。

## 仕様

### 1. 練習履歴の記録

各シナリオに対して以下を記録:
- 練習回数
- 最終練習日
- 累計練習時間
- 各回の評価 (任意、AI 自動採点)

### 2. マスター度の可視化

```
シナリオ: 1on1
進捗: ████████░░ 80% (8/10 回)
マスター度: B+ → A まであと2回
```

各シナリオに目標回数 (10回 や 20回) を設定。

### 3. ダッシュボード

```
/practice/dashboard:
- 全 12 シナリオのマスター度総覧
- 連続練習日数 (Streak: 5日連続)
- 累計練習時間 (Total: 8時間 32分)
- 今週の達成度
```

### 4. ゲーミフィケーション要素

- バッジ: 「1on1 マスター」「3日連続」「10時間達成」
- レベルアップ: 全シナリオを 10回ずつ → 「ビジネス英語 Lv.5」
- 比較: 「上位 30% に入っています」

## 技術仕様

### データ保存先

選択肢:

#### 案A: Clerk publicMetadata (推奨、シンプル)
```typescript
publicMetadata: {
  practice: {
    "scenario_1on1": {
      count: 8,
      lastAt: "2026-05-10T10:00:00Z",
      totalSec: 7200
    },
    "scenario_daily_standup": {
      count: 3,
      ...
    }
  }
}
```

メリット:
- DB 不要
- Clerk 既存基盤で完結
- 実装コスト最小

デメリット:
- データサイズ制限 (Clerk metadata は 8KB)
- 12シナリオ × メタデータ程度なら余裕

#### 案B: Supabase / Postgres
```sql
CREATE TABLE practice_history (
  user_id TEXT,
  scenario_id TEXT,
  count INTEGER,
  last_at TIMESTAMP,
  total_sec INTEGER,
  PRIMARY KEY (user_id, scenario_id)
);
```

メリット:
- スケーラブル
- 詳細な分析が可能
- 各セッションの履歴も残せる

デメリット:
- DB 追加でアーキテクチャが複雑化
- biz-english-master は現状 DB レス

### 推奨: 案A (Clerk publicMetadata)

理由:
- biz-english-master の現アーキテクチャ (DB レス) と整合
- 12シナリオ程度なら 8KB に余裕で収まる
- Phase 3 でユーザー数が増えた時に Supabase 移行を検討

### UI 実装

新規ページ:
```
/practice/dashboard - マスター度総覧
```

既存ページ修正:
```
/practice - サイドバーに進捗バー追加 (各シナリオの横に)
/practice/[scenarioId] - 完了時に「+1 回 練習しました」表示
```

## 実装ステップ

### Step 1: データ構造の設計 (30分)
TypeScript の型定義から:
```typescript
type PracticeHistory = {
  count: number;
  lastAt: string;
  totalSec: number;
};

type UserPracticeData = {
  [scenarioId: string]: PracticeHistory;
};
```

### Step 2: 練習完了時に履歴更新 (1時間)
```typescript
// シナリオ完了時に呼ばれる
async function recordPractice(scenarioId: string, durationSec: number) {
  const user = await currentUser();
  const existing = user.publicMetadata.practice ?? {};
  const updated = {
    ...existing,
    [scenarioId]: {
      count: (existing[scenarioId]?.count ?? 0) + 1,
      lastAt: new Date().toISOString(),
      totalSec: (existing[scenarioId]?.totalSec ?? 0) + durationSec,
    },
  };
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: { ...user.publicMetadata, practice: updated },
  });
}
```

### Step 3: ダッシュボード UI (3-4時間)
- /practice/dashboard ページ作成
- マスター度バー (各シナリオ)
- 連続日数表示
- 累計時間表示

### Step 4: サイドバーに進捗表示 (1-2時間)
- 既存の /practice 画面を改修
- 各シナリオ行に進捗バー追加

### Step 5: ゲーミフィケーション (任意、3-5時間)
- バッジシステム
- レベル表示

## 想定工数

```
Step 1-4: 6-8時間 (1-2日)
Step 5 (任意): 3-5時間
合計: 10-13時間 (2日)
```

---

# Task 2.1: シナリオに Persona バリエーション追加

## 背景

12シナリオを増やしたい。ただし**コンテンツ追加コストは抑えたい**。

## 解決策

各シナリオに **Persona (登場人物のバリエーション)** を追加する。

### 例

```
1on1 シナリオ:
- Persona A: Manager との 1on1 (報告者立場)
- Persona B: Skip-Level Manager との 1on1 (大ボスとの会話)
- Persona C: Cross-functional Lead との 1on1 (横断調整)

Daily Standup シナリオ:
- Persona A: Tech Lead として 進捗共有
- Persona B: IC として 進捗共有
- Persona C: Newcomer として 進捗共有

評価面談シナリオ:
- Persona A: 評価される側
- Persona B: 評価する側
- Persona C: 360度評価 (peer feedback)

Networking Lunch シナリオ:
- Persona A: ベテランエンジニアと
- Persona B: 同期 / 同レベルの人と
- Persona C: 違う部署の人と
```

これで 4シナリオ × 3 Persona = **12 → 36 シナリオ**に増える。

## 技術仕様

### データ構造

```typescript
type Scenario = {
  id: string;
  title: string;
  description: string;
  personas: Persona[];
};

type Persona = {
  id: string;
  name: string; // "Manager", "Skip-Level"
  role: string; // 役割の説明
  systemPrompt: string; // AI の役割設定
  initialMessage: string; // 開幕の発話
};
```

### AI Prompt の調整

各 Persona に対して、AI の system prompt を調整:

```typescript
const personaPrompts = {
  "1on1_manager": `
You are a manager having a 1on1 meeting with your direct report.
Style: Caring but professional. Ask open-ended questions.
Goal: Help the report grow and identify blockers.
`,
  "1on1_skip_level": `
You are a skip-level manager (boss of the user's manager) 
having a 1on1 meeting with the user.
Style: Higher altitude, strategic, time-conscious.
Goal: Get a bird's-eye view of the team and identify issues.
`,
  // ...
};
```

### UI

シナリオ選択画面で Persona も選べるように:

```
シナリオ: 1on1
↓
Persona: Manager / Skip-Level / Cross-functional Lead
↓
開始
```

## 想定工数

```
- Persona 設計: 4シナリオ × 3 Persona = 12 Persona の設計 (4時間)
- AI Prompt 作成: 12 × 30分 = 6時間
- UI 修正: 2時間
- テスト: 2時間

合計: 14時間 (約 2日)
```

---

# Task 2.2: ユーザーテスト (5-10人)

## 背景

biz-english-master を実ユーザーに使ってもらい、フィードバックを収集する。

## 募集方法

### 候補:
1. **X (Twitter) でのお願い**: @takepon_7 のフォロワー
2. **個人ネットワーク**: 知人、元同僚、コミュニティメンバー
3. **Reddit / IndieHackers**: r/japanlife, r/EnglishLearning 等
4. **Twitter で Build in Public 系のコミュニティに投稿**

### 募集文の例

```
Build in Public 中の biz-english-master、ベータテスター 5名募集します。

■ 概要
外資・グローバル企業の日本人ビジネスパーソン向け
AI で英語ロールプレイ練習ができる Web アプリ
月額 ¥2,980 (税抜)、7日間無料トライアル付き

■ 求めている人
- 業務で英語を使う日本人
- AI 英会話練習に興味がある
- 30分以上使ってフィードバックをくれる方

■ お礼
- 1ヶ月分の利用権を無料でプレゼント
- フィードバックに反映されたらお礼ツイート

申込は DM で。
```

## フィードバック収集

### Google Form

```
1. 7日間無料トライアルを試した感想 (5段階)
2. 一番気に入った機能は?
3. 一番不満だった点は?
4. 12 シナリオは多い? 少ない? ちょうど良い?
5. 企業文化選択肢で「自分の会社っぽい」と思ったもの
6. 音声品質 (1-5)
7. UI / UX (1-5)
8. 月 ¥2,980 は適正?
9. その他フリーコメント
```

### 想定知見

```
- コンテンツ拡充の優先度の確認
- 企業文化選択肢の見直し基準
- 音声品質の改善優先度
- 価格感応度
```

## 想定工数

```
- 募集文作成 + 投稿: 1時間
- 5-10人の対応: 1人 30分 × 平均 7人 = 3.5時間
- フィードバック分析: 2時間
- 改善計画への反映: 1時間

合計: 7-8時間 (途中の対応待ち含めて 1週間程度)
```

---

# Task 3.x: フィードバック駆動の改善

## 想定される改善方向 (フィードバック次第)

### 多数が「企業文化が合わない」と言う場合

```
- 現状3つの選択肢を 5-7 に拡張
- ユーザー自身が文化を入力できる「カスタム」選択肢
```

### 多数が「コンテンツ少ない」と言う場合

```
- Phase 2 (Persona 追加) を加速
- Phase 3 (動的シナリオ生成) を計画
- シナリオ追加 (12 → 30)
```

### 多数が「音声が変」と言う場合

```
- Style-Bert-VITS2 への移行を加速 (元々の予定)
- Azure TTS Standard Tier に変更
- ElevenLabs API 検討
```

### 多数が「価格高い」と言う場合

```
- ¥2,980 → ¥1,980 への値下げ検討
- または年額プラン (¥19,800/年 = 月実質 ¥1,650) 追加
```

---

# 総合スケジュール

```
2026/05/07 (木) Week 1 開始
   - 朝 : 音声バグ調査 (F12 で原因特定)
   - 夕 : 音声バグ修正 (ウォームアップ実装)
   - 夜 : デプロイ + 動作確認

2026/05/08 (金)
   - 反復価値化のデータ構造設計
   - 練習完了時の履歴更新実装

2026/05/09-10 (土日)
   - ダッシュボード UI 実装
   - サイドバーに進捗表示

2026/05/11-13 (月-水)
   - ゲーミフィケーション (任意)
   - Week 1 完了、Week 2 へ

2026/05/14-16 (木-土)
   - Persona 設計
   - AI Prompt 作成
   - UI 修正

2026/05/17-20 (日-水)
   - ユーザーテスト募集 (X で投稿)
   - 5-10 人の対応開始
   - フィードバック収集

2026/05/21〜
   - フィードバック分析
   - 優先順位再設計
   - Phase 3 へ
```

---

# 注意事項 (連休明けの自分へ)

1. **音声バグの修正を最優先**: ユーザーテスト前に絶対直す
2. **Clerk publicMetadata の容量確認**: 12シナリオで 8KB 超えないか
3. **Persona 追加時は AI Prompt の品質に時間をかける**: 雑な Prompt だと UX 低下
4. **ユーザーテストの募集は早めに**: 反応が遅いことを前提に
5. **フィードバックを過剰に重視しない**: 5-10人の声は参考、決定は自分

連休 4日間で本番運用準備までできた。**焦らず、データを見ながら進める**。
