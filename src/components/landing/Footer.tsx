export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-lg font-bold text-white">biz-english-master</p>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col gap-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 takepon7. All rights reserved.</p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="#" className="text-gray-300 transition hover:text-white">
                利用規約
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 transition hover:text-white">
                プライバシーポリシー
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 transition hover:text-white">
                特定商取引法に基づく表記
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 transition hover:text-white">
                お問い合わせ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
