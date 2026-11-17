import { describePlayersError, playersCopy } from "../copy";
import type { RemovePhotoState } from "../actions/remove-my-player-photo";
import type { UploadPhotoState } from "../actions/upload-my-player-photo";

export function PhotoFeedback({
  uploadState,
  removeState,
}: {
  uploadState: UploadPhotoState;
  removeState: RemovePhotoState;
}): React.JSX.Element | null {
  const message = feedbackMessage(uploadState, removeState);
  if (!message) return null;
  const failed =
    (uploadState !== null && !uploadState.ok) || (removeState !== null && !removeState.ok);
  return (
    <p
      role={failed ? "alert" : "status"}
      className={`text-sm ${failed ? "font-bold text-hot" : ""}`}
    >
      {message}
    </p>
  );
}

function feedbackMessage(
  uploadState: UploadPhotoState,
  removeState: RemovePhotoState,
): string | null {
  if (uploadState?.ok) return playersCopy.photo.saved;
  if (removeState?.ok) return playersCopy.photo.removed;
  if (uploadState && !uploadState.ok) {
    return uploadState.error === "invalid_input"
      ? playersCopy.photo.wrongType
      : describePlayersError(uploadState.error);
  }
  if (removeState && !removeState.ok) return describePlayersError(removeState.error);
  return null;
}
