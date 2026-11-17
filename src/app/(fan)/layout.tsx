import { FanBottomNav, FanBrandBar } from "@/features/fan";
import { SoftNavBusy } from "@/ui/soft-nav-busy";
import { SoftNavProvider } from "@/ui/soft-nav-context";

type FanLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function FanLayout({ children }: FanLayoutProps): React.JSX.Element {
  return (
    <SoftNavProvider>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
        <header className="sticky top-0 z-10 border-b-2 border-line bg-canvas/95 backdrop-blur-sm">
          <FanBrandBar />
        </header>
        <main className="flex-1 pb-24">
          <SoftNavBusy>{children}</SoftNavBusy>
        </main>
        <FanBottomNav />
      </div>
    </SoftNavProvider>
  );
}
