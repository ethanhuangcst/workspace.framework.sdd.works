export type InstructionsPageTab = {
  id: string;
  type: "code" | "content" | "embedded_external_page";
  queryParam: string;
  labelKey: string;
  panelTestId: string;
  html?: string;
  embedUrl?: string;
};

export function guideTabTestId(tabId: string): string {
  if (tabId === "scrum-in-sdd") return "guide-tab-scrum";
  if (tabId === "learn-scrum-in-sdd") return "guide-tab-learn-scrum";
  return `guide-tab-${tabId}`;
}

export function guideTabDomId(tabId: string): string {
  if (tabId === "scrum-in-sdd") return "tab-scrum";
  return `tab-${tabId}`;
}

export function contentBodyTestId(tabId: string): string {
  if (tabId === "features") return "features-body";
  if (tabId === "scrum-in-sdd") return "scrum-body";
  return `${tabId}-body`;
}

export function contentBodyClassName(tabId: string): string {
  if (tabId === "features") return "guide-section features-body";
  if (tabId === "scrum-in-sdd") return "guide-section scrum-body";
  return "guide-section portal-content-body";
}
