import { currentUser } from "@clerk/nextjs/server";
import { getIsProByEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 現在のユーザーが Pro（制限バイパス）かどうかを返す。
 * 今後の「本日あと○回」等の UI で、Pro の場合は制限表示を出さないために利用。
 */
export async function GET() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const isPro = getIsProByEmail(email);
  return Response.json({ isPro });
}
