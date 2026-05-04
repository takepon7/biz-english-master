"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          router.push("/practice");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ご登録ありがとうございます
        </h1>
        <p className="text-gray-600 mb-2">
          7日間の無料トライアルが開始されました。
        </p>
        <p className="text-gray-500 text-sm mb-8">
          いつでも解約可能です。
        </p>

        <Link
          href="/practice"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
        >
          練習画面に進む →
        </Link>

        <p className="text-gray-400 text-xs mt-6">
          {secondsLeft > 0
            ? `${secondsLeft}秒後に自動で進みます...`
            : "移動中..."}
        </p>
      </div>
    </main>
  );
}
