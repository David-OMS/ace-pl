import { PasswordSignUpForm } from "./password-sign-up-form";

type SignUpOptionsProps = {
  next: string;
  /** Player name from the claim link. Null when the person is creating a normal account. */
  lockedName?: string;
};

/** Email and password sign-up. Google stays off until a Google Cloud client exists. */
export function SignUpOptions({ next, lockedName }: SignUpOptionsProps): React.JSX.Element {
  return <PasswordSignUpForm next={next} lockedName={lockedName ?? null} />;
}
