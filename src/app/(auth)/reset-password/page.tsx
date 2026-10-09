import { ResetPasswordPageClient } from "@/components/features/ResetPasswordPageClient";
import { getRequestLocale } from "@/lib/request-locale";

export default async function ResetPasswordRoute() {
  const locale = await getRequestLocale();
  return <ResetPasswordPageClient initialLocale={locale} />;
}
