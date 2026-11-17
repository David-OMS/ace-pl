import { MagicLinkForm } from "./magic-link-form";

type SignUpOptionsProps = { next: string };

/** Email sign-up. Google stays off until a Google Cloud client exists. */
export function SignUpOptions({ next }: SignUpOptionsProps): React.JSX.Element {
  return <MagicLinkForm next={next} />;
}
