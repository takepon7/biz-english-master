import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | biz-english-master",
  description: "biz-english-master の特定商取引法に基づく表記。",
};

export default function LegalPage() {
  const email = process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "[メールアドレス]";
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          特定商取引法に基づく表記
        </h1>

        <dl className="space-y-8">
          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              販売事業者
            </dt>
            <dd className="text-base text-gray-900">武田　遼介</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              販売責任者
            </dt>
            <dd className="text-base text-gray-900">武田　遼介</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              所在地
            </dt>
            <dd className="text-base text-gray-900">
              〒170-0013
              <br />
              東京都豊島区東池袋2丁目62番8号BIGオフィスプラザ池袋1206
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              電話番号
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              お問い合わせは原則メールにてお願いいたします。
              <br />
              電話番号については、請求があった場合に遅滞なく開示いたします。
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              メールアドレス
            </dt>
            <dd className="text-base text-gray-900">
              <a
                href={`mailto:${email}`}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {email}
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              販売価格
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              <p className="mb-2">各サービスページに表示しております。</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>ビジネス英語コーチング Pro: 月額 ¥2,980 (税抜) / ¥3,278 (税込)</li>
              </ul>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              商品代金以外の必要料金
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              <ul className="list-disc list-inside text-gray-700">
                <li>通信費: お客様のご負担</li>
                <li>消費税: 上記価格に含まれます (税込価格表示)</li>
              </ul>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              お支払い方法
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              <p className="mb-2">クレジットカード決済 (Stripe 経由)</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>対応カードブランド: Visa, Mastercard, American Express, JCB</li>
              </ul>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              お支払い時期
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              <ul className="list-disc list-inside text-gray-700">
                <li>月額プラン: お申込時に決済 (7日間の無料トライアル後、自動的に課金)</li>
                <li>課金日: トライアル開始日から8日目、以降毎月同日</li>
              </ul>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              商品の引き渡し時期
            </dt>
            <dd className="text-base text-gray-900">
              お申込み完了後、即時にサービスをご利用いただけます。
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              返品・キャンセルについて
            </dt>
            <dd className="text-base text-gray-900">
              デジタルコンテンツ・サービスの性質上、原則として返金・返品はお受けしておりません。
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              解約について
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              お客様自身でいつでも解約可能です。
              <br />
              解約手続きは、サービス内のアカウント設定 (Stripe Customer Portal) から行えます。
              <br />
              解約後も、お支払い済みの期間の終了日まではサービスをご利用いただけます。
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-gray-500 mb-2">
              動作環境
            </dt>
            <dd className="text-base text-gray-900 leading-relaxed">
              <ul className="list-disc list-inside text-gray-700">
                <li>推奨ブラウザ: 最新版の Chrome, Safari, Firefox, Edge</li>
                <li>インターネット接続環境</li>
              </ul>
            </dd>
          </div>
        </dl>

        <p className="mt-12 text-sm text-gray-500">
          表記更新日: 2026年5月4日
        </p>
      </div>
    </main>
  );
}
