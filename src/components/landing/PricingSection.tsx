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
    <section id="pricing" className="bg-gradient-to-b from-indigo-50/40 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          シンプルな1プラン
        </h2>

        <div className="mx-auto mt-10 w-full max-w-md sm:mt-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8 lg:p-10">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  ¥2,980
                </span>
                <span className="text-base text-gray-600 sm:text-lg">/月</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">(税抜)</p>
            </div>

            <ul className="mt-6 space-y-3 sm:mt-8">
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
                  <span className="text-sm text-gray-700 sm:text-base">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center sm:mt-8">
              <p className="text-sm font-semibold text-gray-900">
                7日間無料トライアル
              </p>
              <p className="mt-1 text-xs text-gray-600">いつでも解約可</p>
            </div>

            <Link
              href="/sign-up"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
            >
              今すぐ始める
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
