import Image from "next/image";

type Scenario = { emoji: string; title: string; subtitle: string };

const phases: { phase: string; description: string; scenarios: Scenario[] }[] = [
  {
    phase: "Day 1 - Week 1",
    description: "入社・オンボーディング",
    scenarios: [
      { emoji: "☕", title: "The Coffee Break", subtitle: "パントリーで同僚と雑談" },
      { emoji: "❓", title: "Clarifying Instructions", subtitle: "曖昧な指示を聞き返す" },
      { emoji: "🛠️", title: "Tech Support Request", subtitle: "IT に設定トラブルを依頼" },
      { emoji: "👥", title: "Meeting the Team", subtitle: "初日・チームに自己紹介" },
    ],
  },
  {
    phase: "Month 1",
    description: "実務・信頼構築",
    scenarios: [
      { emoji: "📊", title: "Pushing Back", subtitle: "無理な納期に代案で調整" },
      { emoji: "💬", title: "Speaking Up", subtitle: "会議で意見を割り込んで言う" },
      { emoji: "📋", title: "Reporting Bad News", subtitle: "ミス・遅延を事実ベースで報告" },
      { emoji: "📅", title: "Daily Standup", subtitle: "朝の進捗共有" },
    ],
  },
  {
    phase: "Month 3",
    description: "文化・評価",
    scenarios: [
      { emoji: "⭐", title: "Asking for Feedback", subtitle: "1on1 で評価・改善点を聞く" },
      { emoji: "🤔", title: "Disagreeing Politely", subtitle: "方針に懸念を論理的に伝える" },
      { emoji: "🎯", title: "Goal Setting Talk", subtitle: "目標設定の 1on1" },
      { emoji: "🍽️", title: "Networking Lunch", subtitle: "先輩とのランチで関係構築" },
    ],
  },
];

export function ScenariosSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            12のシナリオ × 3つのフェーズ
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            入社から3ヶ月、必要な英語を完備
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-5 sm:mt-12 sm:gap-6">
          {phases.map((p) => (
            <div
              key={p.phase}
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
            >
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="text-xl font-bold text-indigo-600 sm:text-2xl">
                  {p.phase}
                </h3>
                <span className="text-sm text-gray-500 sm:text-base">
                  ── {p.description}
                </span>
              </div>
              <ul className="mt-4 space-y-4 sm:space-y-3">
                {p.scenarios.map((s) => (
                  <li
                    key={s.title}
                    className="flex items-start gap-4 sm:items-center sm:gap-3"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-2xl leading-none sm:mt-0 sm:text-xl">
                      {s.emoji}
                    </span>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="font-semibold text-gray-900">
                        {s.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        {s.subtitle}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl sm:mt-14">
          <Image
            src="/landing/screenshot-scenes.png"
            alt="12シナリオが並ぶサイドバー"
            width={1200}
            height={1000}
            className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-gray-200"
          />
        </div>
      </div>
    </section>
  );
}
