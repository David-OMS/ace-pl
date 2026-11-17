import { Card } from "@/ui/card";

import { awardsCopy } from "../copy";
import type { AutoAwardsResult } from "../domain/calculate-auto-awards";

type AdminAwardsAutoProps = {
  awards: AutoAwardsResult;
};

export function AdminAwardsAuto({ awards }: AdminAwardsAutoProps): React.JSX.Element {
  const empty =
    awards.goldenBoot.length === 0 &&
    awards.playmaker.length === 0 &&
    awards.goldenGlove.length === 0;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">{awardsCopy.autoTitle}</h2>
        <span className="text-xs font-bold text-muted">{awardsCopy.autoHint}</span>
      </div>
      <Card className="flex flex-col gap-1">
        <AwardRow label={awardsCopy.goldenBoot} winners={awards.goldenBoot} />
        <AwardRow label={awardsCopy.playmaker} winners={awards.playmaker} />
        <AwardRow label={awardsCopy.goldenGlove} winners={awards.goldenGlove} />
        {empty ? <p className="pt-2 text-xs text-muted">{awardsCopy.autoEmpty}</p> : null}
      </Card>
    </section>
  );
}

function AwardRow({
  label,
  winners,
}: {
  label: string;
  winners: { name: string; value: number }[];
}): React.JSX.Element {
  const text = winners.length === 0 ? "—" : winners.map((w) => `${w.name} (${w.value})`).join(", ");
  return (
    <div className="flex items-center gap-2 border-t border-dashed border-line-soft py-2 first:border-t-0">
      <span className="flex-1 text-sm font-bold">{label}</span>
      <span className="max-w-[60%] truncate text-right font-display text-sm">{text}</span>
    </div>
  );
}
