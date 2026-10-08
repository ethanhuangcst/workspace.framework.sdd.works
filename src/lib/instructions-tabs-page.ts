import type { Locale } from "@/i18n/t";
import {
  resolveInstructionsTabs,
  type ResolvedInstructionsTab,
} from "@/lib/instructions-tabs";

export type { InstructionsPageTab } from "@/lib/instructions-tabs-dom";
export {
  contentBodyClassName,
  contentBodyTestId,
  guideTabDomId,
  guideTabTestId,
} from "@/lib/instructions-tabs-dom";
import type { InstructionsPageTab } from "@/lib/instructions-tabs-dom";

export function mapResolvedTab(tab: ResolvedInstructionsTab): InstructionsPageTab {
  return {
    id: tab.id,
    type: tab.type,
    queryParam: tab.queryParam,
    label: tab.label,
    panelTestId: tab.panelTestId,
    html: tab.html,
    embedUrl: tab.embedUrl,
  };
}

export function resolveActiveTabQueryParam(
  rawTab: string | undefined,
  tabs: readonly InstructionsPageTab[],
): string {
  const setupParam =
    tabs.find((tab) => tab.id === "setup")?.queryParam ?? "setup";
  if (!rawTab?.trim()) return setupParam;
  const match = tabs.find((tab) => tab.queryParam === rawTab);
  return match ? match.queryParam : setupParam;
}

export function buildInstructionsPageModel(
  locale: Locale,
  tabParam?: string,
): {
  tabs: InstructionsPageTab[];
  activeQueryParam: string;
} {
  const resolved = resolveInstructionsTabs(locale);
  const tabs = resolved.tabs.map(mapResolvedTab);
  return {
    tabs,
    activeQueryParam: resolveActiveTabQueryParam(tabParam, tabs),
  };
}

