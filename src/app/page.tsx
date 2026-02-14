"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white">
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
        Biz English Master
      </h1>
      <p className="mb-8 text-center text-slate-400">
        ビジネス英会話の反復練習。AI 相手に実践して、即フィードバック。
      </p>
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
    </div>
  );
}
