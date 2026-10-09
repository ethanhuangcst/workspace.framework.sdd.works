import type { Metadata } from "next";
import { LOCALE_HTML_LANG } from "@/i18n/t";
import { getRequestLocale } from "@/lib/request-locale";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "sdd.works",
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
  const locale = await getRequestLocale();

  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <body>{children}</body>
    </html>
  );
}
