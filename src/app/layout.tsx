import type { Metadata, Viewport } from "next";

import { SITE } from "@/config/site";
import { fontVariables } from "@/theme/fonts";
import { DEFAULT_MODE, DEFAULT_THEME } from "@/theme/theme-config";

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

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} data-mode={DEFAULT_MODE} className={fontVariables}>
      <body className="min-h-dvh bg-canvas font-body text-ink antialiased">{children}</body>
    </html>
  );
}
