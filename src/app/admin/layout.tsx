import { AdminBottomNav, AdminBrandBar } from "@/features/admin";
import { SoftNavBusy } from "@/ui/soft-nav-busy";
import { SoftNavProvider } from "@/ui/soft-nav-context";

type AdminLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function AdminLayout({ children }: AdminLayoutProps): React.JSX.Element {
  return (
    <SoftNavProvider>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-canvas">
        <AdminBrandBar />
        <div className="flex-1 pb-24">
          <SoftNavBusy blocks={3}>{children}</SoftNavBusy>
        </div>
        <AdminBottomNav />
      </div>
    </SoftNavProvider>
  );
}
