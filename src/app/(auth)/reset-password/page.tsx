import { cookies } from "next/headers";
import { ResetPasswordPageClient } from "@/components/features/ResetPasswordPageClient";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function ResetPasswordRoute() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  return <ResetPasswordPageClient initialLocale={locale} />;
}
