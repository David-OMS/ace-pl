import { TextField } from "@/ui/text-field";

import { fantasyCopy } from "../copy";

type CreateStepNameProps = {
  name: string;
  onChange: (name: string) => void;
};

export function CreateStepName({ name, onChange }: CreateStepNameProps): React.JSX.Element {
  return (
    <TextField
      label={fantasyCopy.teamName}
      name="teamName"
      value={name}
      onChange={(event) => onChange(event.target.value)}
      placeholder={fantasyCopy.teamNamePlaceholder}
      maxLength={40}
      required
      autoComplete="off"
    />
  );
}
