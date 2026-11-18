import { Card } from "@/ui/card";

import { fantasyCopy } from "../copy";

export function ScoutingLockedCard(): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-1">
      <p className="font-bold">{fantasyCopy.scoutingFailedTitle}</p>
      <p className="text-sm text-muted">{fantasyCopy.scoutingFailedBody}</p>
    </Card>
  );
}
