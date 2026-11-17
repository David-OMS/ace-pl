import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  authCopy,
  getCurrentUser,
  SIGN_IN_ERROR_PARAM,
  SIGN_IN_NEXT_PARAM,
  SIGN_UP_MODE,
  SignInPanel,
  toSafeRedirectPath,
  toSignInError,
} from "@/features/auth";

export const metadata: Metadata = { title: authCopy.signInTitle };

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({
  searchParams,
}: SignInPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const next = toSafeRedirectPath(params[SIGN_IN_NEXT_PARAM]);

  if (await getCurrentUser()) redirect(next);

  const mode = params.mode === SIGN_UP_MODE ? "sign-up" : "sign-in";
  return <SignInPanel next={next} error={toSignInError(params[SIGN_IN_ERROR_PARAM])} mode={mode} />;
}
