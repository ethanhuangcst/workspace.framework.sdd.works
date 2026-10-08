import type { KnowledgeFolderListing } from "@/lib/knowledge-folder-shared";

export type KnowledgeFolderPanelState = {
  folderSegments: string[];
  doc: string | null;
  listing: KnowledgeFolderListing | null;
  articleHtml: string | null;
  error: string | null;
};

export type InstructionsPageTab = {
  id: string;
  type:
    | "code"
    | "content"
    | "embedded_external_page"
    | "internal_page_folder";
  queryParam: string;
  label: string;
  panelTestId: string;
  html?: string;
  embedUrl?: string;
  rootPath?: string;
  knowledge?: KnowledgeFolderPanelState;
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
  const base = "guide-section guide-md-body";
  if (tabId === "features") return `${base} guide-md-body--catalog`;
  return `${base} guide-md-body--prose`;
}
