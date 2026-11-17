export type FormFeedbackProps = {
  error?: string | null;
  success?: string | null;
};

/** The single line under a form that says whether the last submit worked. */
export function FormFeedback({ error, success }: FormFeedbackProps): React.JSX.Element | null {
  if (error) {
    return (
      <p role="alert" className="text-sm font-bold text-hot">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="text-sm font-bold text-win">
        {success}
      </p>
    );
  }
  return null;
}
