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
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          英語が話せないんじゃない。
          <br />
          業務で使う英語の&quot;型&quot;を知らないだけ。
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              <div className="text-3xl">❌</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
