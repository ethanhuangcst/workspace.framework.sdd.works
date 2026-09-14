import { cookies } from "next/headers";
import { InstructionsClient } from "./InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";

export default async function InstructionsRoute() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  return <InstructionsClient initialLocale={locale} />;
}
