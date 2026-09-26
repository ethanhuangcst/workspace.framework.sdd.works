import { cookies } from "next/headers";
import { InstructionsClient } from "./InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function InstructionsRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const params = await searchParams;
  const tab = params.tab === "features" ? "features" : "setup";
  return <InstructionsClient initialLocale={locale} tab={tab} />;
}
