const problems = [
  {
    title: "800シナリオあるけど、続かない",
    body: "全部やろうと思って結局1日で挫折する。",
  },
  {
    title: "日常英会話ばかり",
    body: "\"What's your hobby?\" は完璧でも 1on1 で発言できない。",
  },
  {
    title: "機械的な添削",
    body: "\"Use 'utilize' instead\" だけ言われても伝わらない。",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
          こんな悩み、ありませんか?
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:mt-14 md:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
            >
              <div className="text-3xl">❌</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
