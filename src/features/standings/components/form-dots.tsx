import type { FormResult } from "../domain/calculate-form";

type FormDotsProps = {
  results: readonly FormResult[];
  teamId: string;
};

export function FormDots({ results, teamId }: FormDotsProps): React.JSX.Element {
  return (
    <div className="flex gap-1">
      {results.map((result, index) => (
        <FormDot key={`${teamId}-${index}-${result}`} result={result} />
      ))}
    </div>
  );
}

function FormDot({ result }: { result: FormResult }): React.JSX.Element {
  const tone = result === "W" ? "bg-win" : result === "D" ? "bg-draw" : "bg-loss";
  return <span className={`inline-block size-2.5 ${tone}`} title={result} aria-label={result} />;
}
