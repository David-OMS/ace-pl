import { TextField } from "@/ui/text-field";

import { tournamentsCopy } from "../copy";

type TournamentDateFieldsProps = {
  startsOn: string;
  endsOn: string;
};

export function TournamentDateFields({
  startsOn,
  endsOn,
}: TournamentDateFieldsProps): React.JSX.Element {
  const { form } = tournamentsCopy;

  return (
    <>
      <TextField
        label={form.startsOn}
        name="startsOn"
        type="date"
        required
        defaultValue={startsOn}
      />
      <TextField label={form.endsOn} name="endsOn" type="date" required defaultValue={endsOn} />
    </>
  );
}
