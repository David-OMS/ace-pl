import { AdminBottomNav, AdminBrandBar } from "@/features/admin";

type AdminLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function AdminLayout({ children }: AdminLayoutProps): React.JSX.Element {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-canvas">
      <AdminBrandBar />
      <div className="flex-1 pb-24">{children}</div>
      <AdminBottomNav />
    </div>
  );
}
