import { Card } from "@/ui/card";

import { playersCopy } from "../copy";
import { CopyLinkButton } from "./copy-link-button";
import { ResetClaimLinkForm } from "./reset-claim-link-form";

type ClaimLinkPanelProps = {
  playerId: string;
  claimUrl: string | null;
  linkedAccountName: string | null;
};

export function ClaimLinkPanel({
  playerId,
  claimUrl,
  linkedAccountName,
}: ClaimLinkPanelProps): React.JSX.Element {
  const copy = playersCopy.claimLink;

  if (linkedAccountName) {
    return (
      <Card>
        <h2 className="font-display text-lg uppercase">{copy.title}</h2>
        <p className="mt-2 text-sm">{copy.linkedTo(linkedAccountName)}</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{copy.title}</h2>
      <p className="text-sm text-muted">{copy.intro}</p>
      {claimUrl ? (
        <>
          <output className="block rounded-card border-2 border-line-soft bg-surface-alt p-2 text-xs break-all">
            {claimUrl}
          </output>
          <CopyLinkButton url={claimUrl} />
        </>
      ) : (
        <p className="text-sm">{copy.missing}</p>
      )}
      <ResetClaimLinkForm playerId={playerId} />
    </Card>
  );
}
