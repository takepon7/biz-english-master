import Link from "next/link";

const features = [
  "全12シナリオ使い放題",
  "3つの企業文化モード",
  "日本語解説付き",
  "音声入力 (発音練習)",
  "練習履歴の保存",
  "ロールプレイ無制限",
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          シンプルな1プラン
        </h2>

        <div className="mx-auto mt-12 max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-gray-900">¥2,980</span>
                <span className="text-lg text-gray-600">/月</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">(税抜)</p>
            </div>

            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.085l6.79-6.795a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm font-semibold text-gray-900">
                7日間無料トライアル
              </p>
              <p className="mt-1 text-xs text-gray-600">いつでも解約可</p>
            </div>

            <Link
              href="/sign-up"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              今すぐ始める
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
