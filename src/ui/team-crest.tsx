type TeamCrestProps = {
  name: string;
  color: string;
  size?: "sm" | "md";
};

export function TeamCrest({ name, color, size = "sm" }: TeamCrestProps): React.JSX.Element {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const box = size === "md" ? "size-9 text-sm" : "size-6 text-[10px]";
  return (
    <span
      className={`inline-flex ${box} shrink-0 items-center justify-center font-extrabold text-white`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
