"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";

import { signUpWithPassword, type PasswordSignUpState } from "../actions/sign-up-with-password";
import { authCopy, describeActionError } from "../copy";
import { PASSWORD_MIN_LENGTH } from "../domain/password-length";

type PasswordSignUpFormProps = {
  next: string;
  lockedName: string | null;
};

export function PasswordSignUpForm({
  next,
  lockedName,
}: PasswordSignUpFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<PasswordSignUpState, FormData>(
    signUpWithPassword,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <SignUpFields lockedName={lockedName} />
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describeActionError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? authCopy.creatingAccount : authCopy.createAccount}
      </Button>
    </form>
  );
}

function SignUpFields({ lockedName }: { lockedName: string | null }): React.JSX.Element {
  return (
    <>
      <TextField
        label={authCopy.nameLabel}
        name="name"
        autoComplete="name"
        required
        readOnly={lockedName !== null}
        defaultValue={lockedName ?? ""}
        maxLength={40}
        className="read-only:bg-surface-alt read-only:text-muted"
      />
      <TextField
        label={authCopy.emailLabel}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={authCopy.emailPlaceholder}
      />
      <TextField
        label={authCopy.passwordLabel}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
        hint={authCopy.forgotPasswordNote}
      />
    </>
  );
}
