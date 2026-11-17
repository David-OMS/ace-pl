"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/ui/button";
import { Icon } from "@/ui/icon";
import { TextField } from "@/ui/text-field";

import { sendMagicLink, type MagicLinkState } from "../actions/send-magic-link";
import { authCopy, describeActionError } from "../copy";

type MagicLinkFormProps = { next: string };

export function MagicLinkForm({ next }: MagicLinkFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<MagicLinkState, FormData>(
    sendMagicLink,
    null,
  );

  if (state?.ok) {
    return (
      <p role="status" className="rounded-card border-2 border-line bg-surface-alt p-3 text-sm">
        {authCopy.linkSent(state.data.email)}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <TextField
        label={authCopy.emailLabel}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={authCopy.emailPlaceholder}
      />
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describeActionError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        <Icon icon={Mail} size="sm" />
        {isPending ? authCopy.sendingLink : authCopy.sendLink}
      </Button>
    </form>
  );
}
