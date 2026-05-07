import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | biz-english-master",
  description: "biz-english-master のプライバシーポリシー。",
};

export default function PrivacyPage() {
  const email = process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "[メールアドレス]";
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          プライバシーポリシー
        </h1>

        <p className="text-base text-gray-700 leading-loose mb-12">
          武田　遼介(以下「当方」といいます)は、当方が提供する「ビジネス英語コーチング Pro」(以下「本サービス」といいます)における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー(以下「本ポリシー」といいます)を定めます。
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第1条 (個人情報)</h2>
          <p className="text-base text-gray-700 leading-loose">
            「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報(個人識別情報)を指します。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第2条 (個人情報の収集方法)</h2>
          <p className="text-base text-gray-700 leading-loose mb-4">
            当方は、ユーザーが利用登録をする際に以下の情報を取得します。
          </p>
          <ul className="list-disc list-inside text-base text-gray-700 leading-loose space-y-1">
            <li>メールアドレス</li>
            <li>氏名 (ご登録時に入力された場合)</li>
            <li>認証情報 (パスワード等は当方では保持せず、認証基盤 (Clerk) で管理されます)</li>
            <li>お支払い情報 (クレジットカード番号等は当方では保持せず、決済代行サービス (Stripe) に直接送信されます)</li>
            <li>利用ログ、デバイス情報、IP アドレス</li>
            <li>お問い合わせ内容</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第3条 (個人情報を収集・利用する目的)</h2>
          <p className="text-base text-gray-700 leading-loose mb-4">
            当方が個人情報を収集・利用する目的は、以下のとおりです。
          </p>
          <ol className="list-decimal list-inside text-base text-gray-700 leading-loose space-y-1">
            <li>本サービスの提供・運営のため</li>
            <li>ユーザーからのお問い合わせに回答するため</li>
            <li>ユーザーが利用中のサービス、新機能、更新情報、キャンペーン等のお知らせを送付するため</li>
            <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
            <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
            <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
            <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
            <li>上記の利用目的に付随する目的</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第4条 (利用目的の変更)</h2>
          <p className="text-base text-gray-700 leading-loose">
            当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
            利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第5条 (個人情報の第三者提供)</h2>
          <p className="text-base text-gray-700 leading-loose mb-4">
            当方は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
          </p>
          <ol className="list-decimal list-inside text-base text-gray-700 leading-loose space-y-1">
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第6条 (外部サービスへの個人情報の提供)</h2>
          <p className="text-base text-gray-700 leading-loose mb-4">
            本サービスは、以下の外部サービスを利用しており、サービス提供のために必要な範囲で、これらの事業者に対して個人情報を提供します。
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Clerk Inc. (認証サービス)</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 ml-4">
                <li>提供情報: メールアドレス、氏名、認証情報</li>
                <li>
                  プライバシーポリシー:{" "}
                  <a
                    href="https://clerk.com/legal/privacy"
                    className="text-indigo-600 hover:text-indigo-500 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://clerk.com/legal/privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stripe, Inc. (決済サービス)</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 ml-4">
                <li>提供情報: メールアドレス、氏名、決済情報</li>
                <li>
                  プライバシーポリシー:{" "}
                  <a
                    href="https://stripe.com/jp/privacy"
                    className="text-indigo-600 hover:text-indigo-500 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://stripe.com/jp/privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Vercel Inc. (ホスティングサービス)</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 ml-4">
                <li>提供情報: アクセスログ、IP アドレス</li>
                <li>
                  プライバシーポリシー:{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    className="text-indigo-600 hover:text-indigo-500 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Google LLC (Gemini AI API)</p>
              <ul className="list-disc list-inside text-gray-700 mt-1 ml-4">
                <li>提供情報: ユーザーが入力した英会話の内容 (個人を特定する情報は含めない)</li>
                <li>
                  プライバシーポリシー:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-indigo-600 hover:text-indigo-500 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://policies.google.com/privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第7条 (個人情報の開示)</h2>
          <p className="text-base text-gray-700 leading-loose mb-4">
            当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。
            ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
          </p>
          <ol className="list-decimal list-inside text-base text-gray-700 leading-loose space-y-1">
            <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
            <li>当方の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
            <li>その他法令に違反することとなる場合</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第8条 (個人情報の訂正および削除)</h2>
          <ol className="list-decimal list-inside text-base text-gray-700 leading-loose space-y-2">
            <li>ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、当方に対して個人情報の訂正、追加または削除を請求することができます。</li>
            <li>当方は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正、追加または削除を行うものとします。</li>
            <li>当方は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第9条 (個人情報の利用停止等)</h2>
          <ol className="list-decimal list-inside text-base text-gray-700 leading-loose space-y-2">
            <li>当方は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去を求められた場合には、遅滞なく必要な調査を行います。</li>
            <li>前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。</li>
            <li>当方は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第10条 (プライバシーポリシーの変更)</h2>
          <p className="text-base text-gray-700 leading-loose">
            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
            当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">第11条 (お問い合わせ窓口)</h2>
          <p className="text-base text-gray-700 leading-loose">
            本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
          </p>
          <p className="mt-4 text-base text-gray-900">
            メールアドレス:{" "}
            <a
              href={`mailto:${email}`}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {email}
            </a>
          </p>
        </section>

        <p className="mt-12 text-sm text-gray-500">
          制定日: 2026年5月4日
        </p>
      </div>
    </main>
  );
}
