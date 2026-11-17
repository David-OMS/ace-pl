"use client";

import { useActionState } from "react";

import { FAN_HOME_PATH } from "@/features/fan";
import { Button } from "@/ui/button";
import { ButtonLink } from "@/ui/button-link";
import { PlayerAvatar } from "@/ui/player-avatar";

import { uploadMyPlayerPhoto, type UploadPhotoState } from "../actions/upload-my-player-photo";
import { describePlayersError, playersCopy } from "../copy";

type PlayerPhotoFormProps = {
  name: string;
  photoUrl: string | null;
  offerSkip: boolean;
};

function photoMessage(state: UploadPhotoState): string | null {
  if (!state) return null;
  if (state.ok) return playersCopy.photo.saved;
  if (state.error === "invalid_input") return playersCopy.photo.wrongType;
  return describePlayersError(state.error);
}

export function PlayerPhotoForm({
  name,
  photoUrl,
  offerSkip,
}: PlayerPhotoFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<UploadPhotoState, FormData>(
    uploadMyPlayerPhoto,
    null,
  );
  const copy = playersCopy.photo;
  const message = photoMessage(state);
  const failed = state !== null && !state.ok;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <PlayerAvatar name={name} photoUrl={photoUrl} size="lg" />
        <div>
          <p className="font-bold">{photoUrl ? copy.change : copy.add}</p>
          <p className="text-xs text-muted">{copy.hint}</p>
        </div>
      </div>
      <input
        type="file"
        name="photo"
        accept="image/jpeg,image/png,image/webp"
        required
        className="text-sm"
      />
      {failed && message ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {message}
        </p>
      ) : null}
      {!failed && message ? (
        <p role="status" className="text-sm">
          {message}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? copy.saving : copy.save}
      </Button>
      {offerSkip ? (
        <ButtonLink href={FAN_HOME_PATH} variant="secondary" fullWidth>
          {copy.skip}
        </ButtonLink>
      ) : null}
    </form>
  );
}
