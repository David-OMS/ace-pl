import { FanBottomNav, FanBrandBar } from "@/features/fan";
import { readThemeMode } from "@/theme/read-theme-mode";
import { SoftNavBusy } from "@/ui/soft-nav-busy";
import { SoftNavProvider } from "@/ui/soft-nav-context";

type FanLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function FanLayout({ children }: FanLayoutProps): Promise<React.JSX.Element> {
  const initialMode = await readThemeMode();
  return (
    <SoftNavProvider>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
        <header className="sticky top-0 z-10 border-b-2 border-line bg-canvas/95 backdrop-blur-sm">
          <FanBrandBar initialMode={initialMode} />
        </header>
        <main className="flex-1 pb-24">
          <SoftNavBusy>{children}</SoftNavBusy>
        </main>
        <FanBottomNav />
      </div>
    </SoftNavProvider>
  );
}
