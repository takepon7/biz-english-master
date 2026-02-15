"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ImageLightbox } from "@/components/ImageLightbox";

/** プロダクトキャプチャ画像。public/screenshots/ に画像を置いたらここに追加。クリックでライトボックス表示（GitHub へは遷移しない） */
const PRODUCT_SCREENSHOTS: { src: string; alt: string }[] = [
  // 例: { src: "/screenshots/practice.png", alt: "練習画面" },
];

/** スクリーンショットがまだ無いときのプレースホルダー（1枚だけ表示） */
const FALLBACK_SCREENSHOT = { src: "/next.svg", alt: "Biz English Master" };

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/practice");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
        <p>リダイレクトしています…</p>
      </div>
    );
  }

  const screenshots =
    PRODUCT_SCREENSHOTS.length > 0 ? PRODUCT_SCREENSHOTS : [FALLBACK_SCREENSHOT];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-10 text-white">
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
        Biz English Master
      </h1>
      <p className="mb-6 text-center text-slate-400">
        ビジネス英会話の反復練習。AI 相手に実践して、即フィードバック。
      </p>

      {/* プロダクトキャプチャ：クリックでライトボックス表示（GitHub へは遷移しない） */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {screenshots.map(({ src, alt }) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightbox({ src, alt })}
            className="overflow-hidden rounded-lg border border-slate-600 bg-slate-800/80 shadow-lg transition hover:border-sky-500/50 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <Image
              src={src}
              alt={alt}
              width={280}
              height={180}
              className="h-auto w-auto max-h-40 object-cover object-top"
              unoptimized={src.startsWith("http")}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="hidden max-h-40 min-h-[120px] w-[280px] items-center justify-center bg-slate-700/80 text-xs text-slate-400"
              aria-hidden
            >
              {alt}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/sign-in"
          className="rounded-lg bg-slate-700 px-6 py-3 text-center text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg bg-sky-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Sign Up
        </Link>
      </div>
      <p className="mt-8 text-sm text-slate-500">
        アカウントをお持ちの方は
        <Link href="/practice" className="ml-1 text-sky-400 hover:underline">
          練習を始める
        </Link>
        （ログインが必要です）
      </p>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isOpen={!!lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
