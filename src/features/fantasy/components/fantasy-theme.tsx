type FantasyThemeProps = {
  children: React.ReactNode;
  className?: string;
};

/** Local Retro Kit scope for fantasy screens. */
export function FantasyTheme({ children, className = "" }: FantasyThemeProps): React.JSX.Element {
  return (
    <div data-theme="retro" className={`min-h-full bg-canvas text-ink ${className}`}>
      {children}
    </div>
  );
}
