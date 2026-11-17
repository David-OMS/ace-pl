import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  authCopy,
  ForgotPasswordPanel,
  getCurrentUser,
  SIGN_IN_NEXT_PARAM,
  toSafeRedirectPath,
} from "@/features/auth";

export const metadata: Metadata = { title: authCopy.forgotPasswordTitle };

type ForgotPasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const next = toSafeRedirectPath(params[SIGN_IN_NEXT_PARAM]);
  if (await getCurrentUser()) redirect(next);
  return <ForgotPasswordPanel next={next} />;
}
