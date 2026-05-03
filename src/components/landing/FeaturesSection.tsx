const features = [
  {
    emoji: "🎯",
    title: "12シナリオに絞り込み",
    body: "「ある」シナリオじゃなくて、「使う」シナリオだけ。業務で本当に使うものだけ。",
  },
  {
    emoji: "🏢",
    title: "3つの企業文化モード",
    body: "\"Hey, what's up?\" な Tech Startup West Coast。同じ\"意見を言う\"でも、文化で言い方が変わる。",
  },
  {
    emoji: "🇯🇵",
    title: "日本語で\"なぜ\"を解説",
    body: "\"Could you\" と \"Can you\" の違い。英語の\"型\"を、日本語で深く理解できる。",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            3つの理由
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            biz-english-master が選ばれる
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:mt-14 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
            >
              <div className="text-4xl">{f.emoji}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
