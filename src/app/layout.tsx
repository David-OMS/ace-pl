import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import { SITE } from "@/config/site";
import { RecoverySessionRedirect } from "@/features/auth";
import { fontVariables } from "@/theme/fonts";
import { THEME_MODE_COOKIE } from "@/theme/mode-cookie";
import { DEFAULT_MODE, DEFAULT_THEME, MODES, type ThemeMode } from "@/theme/theme-config";

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

export default async function RootLayout({ children }: RootLayoutProps): Promise<React.JSX.Element> {
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

async function readThemeMode(): Promise<ThemeMode> {
  const value = (await cookies()).get(THEME_MODE_COOKIE)?.value;
  return MODES.includes(value as ThemeMode) ? (value as ThemeMode) : DEFAULT_MODE;
}
