import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8">
        <p className="text-2xl font-bold text-white">biz-english-master</p>

        <hr className="my-8 border-t border-gray-800" />

        <div className="flex flex-col gap-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 takepon7. All rights reserved.</p>

          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li>
              <Link
                href="/terms"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                利用規約
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="/legal"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                特定商取引法に基づく表記
              </Link>
            </li>
            <li>
              <a
                href="mailto:takeponn7@gmail.com"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                お問い合わせ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
