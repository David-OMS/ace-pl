import type { Metadata } from "next";

import { authCopy, getCurrentUser, NewPasswordPanel } from "@/features/auth";

export const metadata: Metadata = { title: authCopy.newPasswordTitle };

export default async function NewPasswordPage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  return <NewPasswordPanel hasSession={user !== null} />;
}
