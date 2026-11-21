import type { Metadata, Viewport } from "next";

import { SITE } from "@/config/site";
import { RecoverySessionRedirect } from "@/features/auth";
import { fontVariables } from "@/theme/fonts";
import { readThemeMode } from "@/theme/read-theme-mode";
import { DEFAULT_THEME } from "@/theme/theme-config";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<React.JSX.Element> {
  const mode = await readThemeMode();
  return (
    <html lang="en" data-theme={DEFAULT_THEME} data-mode={mode} className={fontVariables}>
      <body className="min-h-dvh bg-canvas font-body text-ink antialiased">
        <RecoverySessionRedirect />
        {children}
      </body>
    </html>
  );
}
