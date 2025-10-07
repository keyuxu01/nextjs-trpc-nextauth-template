import {
  ServerComponentExample,
  TRPCAdvancedTest,
  TRPCTest,
  UserSession,
} from "@/components/business";
import { Button } from "@/components/ui";
import { OAUTH_SIGN_IN_URL } from "@/constants/path";
import { getServerSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  console.log(`
    Server session: ${JSON.stringify(session, null, 2)}
  `);

  if (!session) {
    redirect(OAUTH_SIGN_IN_URL);
  }

  return (
    <div className="h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <UserSession />
      <TRPCTest />
      <TRPCAdvancedTest />
      <ServerComponentExample />
      <Button>click</Button>
    </div>
  );
}
