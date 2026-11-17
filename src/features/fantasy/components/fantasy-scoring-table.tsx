import { fantasyScoringRows } from "@/config/fantasy-scoring";

import { fantasyCopy } from "../copy";

export function FantasyScoringTable(): React.JSX.Element {
  const rows = fantasyScoringRows();
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{fantasyCopy.scoringTitle}</h2>
      <p className="text-xs text-muted">{fantasyCopy.scoringHint}</p>
      <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
        <table className="w-full min-w-[20rem] text-left text-xs">
          <thead>
            <tr className="border-b-2 border-line bg-surface-alt">
              <th className="px-2 py-2 font-bold">{fantasyCopy.scoringEvent}</th>
              <th className="px-2 py-2 font-bold">GK</th>
              <th className="px-2 py-2 font-bold">DEF</th>
              <th className="px-2 py-2 font-bold">MID</th>
              <th className="px-2 py-2 font-bold">FWD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.event} className="border-b border-line-soft last:border-b-0">
                <td className="px-2 py-2 font-bold">{row.event}</td>
                <td className="px-2 py-2">{row.gk}</td>
                <td className="px-2 py-2">{row.def}</td>
                <td className="px-2 py-2">{row.mid}</td>
                <td className="px-2 py-2">{row.fwd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
