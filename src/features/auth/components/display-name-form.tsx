"use client";

import { useActionState } from "react";

import { useRefreshOnOk } from "@/lib/use-refresh-on-ok";
import { Button } from "@/ui/button";
import { FormFeedback } from "@/ui/form-feedback";
import { TextField } from "@/ui/text-field";

import { updateDisplayName, type UpdateDisplayNameState } from "../actions/update-display-name";
import { authCopy, describeActionError } from "../copy";

type DisplayNameFormProps = {
  currentName: string;
};

export function DisplayNameForm({ currentName }: DisplayNameFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UpdateDisplayNameState, FormData>(
    updateDisplayName,
    null,
  );
  useRefreshOnOk(state?.ok);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField
        label={authCopy.displayNameLabel}
        name="displayName"
        defaultValue={currentName}
        maxLength={40}
        required
        autoComplete="nickname"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? authCopy.savingDisplayName : authCopy.saveDisplayName}
      </Button>
      <FormFeedback
        error={
          state?.ok === false
            ? state.error === "invalid_input"
              ? authCopy.displayNameInvalid
              : describeActionError(state.error)
            : null
        }
        success={state?.ok ? authCopy.displayNameSaved : null}
      />
    </form>
  );
}
