const faqs = [
  {
    q: "解約はいつでもできますか?",
    a: "はい。Stripe Customer Portal からいつでも解約できます。解約してもその月の終わりまでは利用できます。",
  },
  {
    q: "7日間の無料期間中に課金されますか?",
    a: "されません。8日目から自動的に課金されます。無料期間中に解約すれば一切料金は発生しません。",
  },
  {
    q: "英語初心者でも使えますか?",
    a: "TOEIC 600以上、または「読み書きはできるが話すのが苦手」な方に最適です。完全初心者には他のサービスをお勧めします。",
  },
  {
    q: "領収書は出せますか?",
    a: "はい。Stripe Customer Portal から PDF の領収書をダウンロードできます。会社経費として精算する方も多くいます。",
  },
  {
    q: "法人契約はできますか?",
    a: "現在は個人プランのみですが、3名以上の法人ニーズがあればご相談ください。",
  },
  {
    q: "iPhone アプリはありますか?",
    a: "現在はWebのみです。スマホのブラウザでもサクサク動きます。将来的に PWA 対応を予定しています。",
  },
];

export function FAQSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <h2 className="mb-12 text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          よくある質問
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition open:shadow-md sm:px-7 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-900 sm:text-lg">
                <span>Q. {item.q}</span>
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400 transition group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                A. {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
