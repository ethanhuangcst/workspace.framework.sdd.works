import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LOCALE_HTML_LANG, type Locale } from "@/i18n/t";
import { getLocaleFromCookieValue } from "@/lib/locale";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "framework.sdd.works",
  description: "SDD framework MCP service and admin portal",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale: Locale = getLocaleFromCookieValue(
    cookieStore.get("sdd_locale")?.value,
  );

  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <body>{children}</body>
    </html>
  );
}
