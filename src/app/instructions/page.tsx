import { cookies } from "next/headers";
import { InstructionsClient } from "./InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { buildInstructionsPageModel } from "@/lib/instructions-tabs-page";

export default async function InstructionsRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; path?: string; doc?: string }>;
}) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const params = await searchParams;
  const { tabs, activeQueryParam } = buildInstructionsPageModel(
    locale,
    params.tab,
    params.path,
    params.doc,
  );

  return (
    <InstructionsClient
      initialLocale={locale}
      tabs={tabs}
      activeQueryParam={activeQueryParam}
    />
  );
}
