import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            英語が話せないんじゃない。
            <br />
            業務で使う英語の &quot;型&quot; を
            <br />
            知らないだけ。
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            入社1日目から評価面談まで、
            <br className="hidden sm:block" />
            プロが使うビジネス英語を、12シナリオで最短習得。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              7日間無料で試す
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg bg-transparent px-8 py-4 text-base font-medium text-gray-700 transition hover:bg-gray-100"
            >
              ▶ 機能を見る
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ※クレジットカード登録、いつでも解約可
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl sm:mt-20">
          <Image
            src="/landing/screenshot-roleplay.png"
            alt="AI と会話しながらビジネス英語を学ぶ画面"
            width={1200}
            height={1000}
            className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-gray-200"
            priority
          />
        </div>
      </div>
    </section>
  );
}
