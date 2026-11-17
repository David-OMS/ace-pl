import { buildSignInHref } from "@/features/auth";
import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { fantasyCopy } from "../copy";
import { FANTASY_CREATE_PATH, FANTASY_PATH } from "../routes";

type FantasyEmptyCtaProps = {
  kind: "signed_out" | "no_team" | "no_tournament";
};

export function FantasyEmptyCta({ kind }: FantasyEmptyCtaProps): React.JSX.Element {
  if (kind === "no_tournament") {
    return (
      <Card className="flex flex-col gap-3">
        <p className="text-sm text-muted">{fantasyCopy.noTournament}</p>
      </Card>
    );
  }

  if (kind === "signed_out") {
    return (
      <Card className="flex flex-col gap-3">
        <h1 className="font-display text-2xl uppercase">{fantasyCopy.title}</h1>
        <p className="text-sm text-muted">{fantasyCopy.signInBody}</p>
        <ButtonLink href={buildSignInHref(FANTASY_PATH)} fullWidth>
          {fantasyCopy.signInCta}
        </ButtonLink>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <h1 className="font-display text-2xl uppercase">{fantasyCopy.emptyTitle}</h1>
      <p className="text-sm text-muted">{fantasyCopy.emptyBody}</p>
      <ButtonLink href={FANTASY_CREATE_PATH} fullWidth>
        {fantasyCopy.emptyCta}
      </ButtonLink>
    </Card>
  );
}
