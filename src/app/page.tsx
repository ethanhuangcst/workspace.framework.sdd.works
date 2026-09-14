import { cookies } from "next/headers";
import { HomePageClient } from "@/components/features/HomePageClient";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function HomePageRoute() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  return <HomePageClient initialLocale={locale} />;
}
