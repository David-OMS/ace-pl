import { redirect } from "next/navigation";

import { authCopy, SIGN_IN_ERROR_PARAM, SIGN_IN_PATH, verifyEmailOtp } from "@/features/auth";
import { Button } from "@/ui/button";

type ConfirmPageProps = {
  searchParams: Promise<{
    token_hash?: string | string[];
    redirect_to?: string | string[];
    type?: string | string[];
  }>;
};

export default async function ConfirmSignInPage({
  searchParams,
}: ConfirmPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const tokenHash = first(params.token_hash);
  if (!tokenHash) redirect(`${SIGN_IN_PATH}?${SIGN_IN_ERROR_PARAM}=link`);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5 py-10">
      <h1 className="font-display text-4xl uppercase">{authCopy.confirmTitle}</h1>
      <p className="text-sm">{authCopy.confirmBody}</p>
      <form action={verifyEmailOtp}>
        <input type="hidden" name="token_hash" value={tokenHash} />
        <input
          type="hidden"
          name="type"
          value={first(params.type) === "recovery" ? "recovery" : "email"}
        />
        <input type="hidden" name="redirect_to" value={first(params.redirect_to)} />
        <Button type="submit" fullWidth>
          {authCopy.confirmButton}
        </Button>
      </form>
    </main>
  );
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}
