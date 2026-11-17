"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { TextField } from "@/ui/text-field";

import { setNewPassword, type NewPasswordState } from "../actions/set-new-password";
import { authCopy, describeActionError } from "../copy";
import { PASSWORD_MIN_LENGTH } from "../domain/password-length";

export function NewPasswordForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<NewPasswordState, FormData>(
    setNewPassword,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField
        label={authCopy.passwordLabel}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describeActionError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? authCopy.savingPassword : authCopy.savePassword}
      </Button>
    </form>
  );
}
