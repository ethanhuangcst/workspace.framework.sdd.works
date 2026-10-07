import { cookies } from "next/headers";
import { InstructionsClient } from "./instructions/InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { buildInstructionsPageModel } from "@/lib/instructions-tabs-page";

export default async function HomePageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const params = await searchParams;
  const { tabs, activeQueryParam } = buildInstructionsPageModel(
    locale,
    params.tab,
  );

  return (
    <InstructionsClient
      initialLocale={locale}
      tabs={tabs}
      activeQueryParam={activeQueryParam}
    />
  );
}
