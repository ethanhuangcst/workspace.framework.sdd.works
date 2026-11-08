import { ResetPasswordPageClient } from "@web/components/features/ResetPasswordPageClient";
import { getRequestLocale } from "@shared/lib/request-locale";

export default async function ResetPasswordRoute() {
  const locale = await getRequestLocale();
  return <ResetPasswordPageClient initialLocale={locale} />;
}
