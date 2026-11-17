import { Button } from "@/ui/button";

import { signOut } from "../actions/sign-out";
import { authCopy } from "../copy";

export function SignOutButton(): React.JSX.Element {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary">
        {authCopy.signOut}
      </Button>
    </form>
  );
}
