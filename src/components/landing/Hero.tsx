import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12 md:px-8 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            英語が話せないんじゃない。
            <br />
            業務で使う英語の &quot;型&quot; を
            <br />
            知らないだけ。
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-8 sm:text-lg md:text-xl">
            入社1日目から評価面談まで、
            <br className="hidden sm:block" />
            プロが使うビジネス英語を、12シナリオで最短習得。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              href="/sign-up"
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:w-auto"
            >
              7日間無料で試す
            </Link>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-lg bg-transparent px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto sm:text-lg"
            >
              ▶ 機能を見る
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ※クレジットカード登録、いつでも解約可
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl md:mt-20">
          <Image
            src="/landing/screenshot-roleplay.png"
            alt="AI と会話しながらビジネス英語を学ぶ画面"
            width={1200}
            height={1000}
            className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-gray-200"
            priority
          />
        </div>

        <div className="mb-8 hidden justify-center pt-12 md:flex">
          <div className="animate-bounce text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
