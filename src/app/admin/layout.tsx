import { AdminBottomNav, AdminBrandBar } from "@/features/admin";
import { readThemeMode } from "@/theme/read-theme-mode";
import { SoftNavBusy } from "@/ui/soft-nav-busy";
import { SoftNavProvider } from "@/ui/soft-nav-context";

type AdminLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function AdminLayout({
  children,
}: AdminLayoutProps): Promise<React.JSX.Element> {
  const initialMode = await readThemeMode();
  return (
    <SoftNavProvider>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-canvas">
        <AdminBrandBar initialMode={initialMode} />
        <div className="flex-1 pb-24">
          <SoftNavBusy blocks={3}>{children}</SoftNavBusy>
        </div>
        <AdminBottomNav />
      </div>
    </SoftNavProvider>
  );
}
