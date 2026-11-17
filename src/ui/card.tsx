import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article";
};

export function Card({
  as: Element = "section",
  className = "",
  ...rest
}: CardProps): React.JSX.Element {
  return (
    <Element
      className={`rounded-card border-2 border-line bg-surface p-4 shadow-offset ${className}`}
      {...rest}
    />
  );
}
