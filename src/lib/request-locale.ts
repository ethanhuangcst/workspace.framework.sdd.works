import { cookies, headers } from "next/headers";
import type { Locale } from "@/i18n/t";
import { resolveLocale, SDD_LOCALE_COOKIE } from "@/lib/locale";

/** Resolve portal locale for App Router pages from cookie + Accept-Language. */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  return resolveLocale({
    cookie: cookieStore.get(SDD_LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
}
