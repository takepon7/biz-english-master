import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-bold text-gray-900 sm:text-lg">
          Biz English Master
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          <a
            href="#features"
            className="hidden text-gray-700 hover:text-gray-900 sm:inline"
          >
            機能
          </a>
          <a
            href="#pricing"
            className="hidden text-gray-700 hover:text-gray-900 sm:inline"
          >
            料金
          </a>
          <Link
            href="/sign-in"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            ログイン
          </Link>
        </nav>
      </div>
    </header>
  );
}
