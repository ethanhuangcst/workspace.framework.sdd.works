import type { Locale } from "@/i18n/t";
import {
  resolveInstructionsTabs,
  type ResolvedInstructionsTab,
} from "@/lib/instructions-tabs";
import {
  parseKnowledgePathParam,
  resolveKnowledgeArticle,
  resolveKnowledgeFolderListing,
  validateKnowledgePathSegments,
} from "@/lib/knowledge-folder";

export type { InstructionsPageTab } from "@/lib/instructions-tabs-dom";
export {
  contentBodyClassName,
  contentBodyTestId,
  guideTabDomId,
  guideTabTestId,
} from "@/lib/instructions-tabs-dom";
import type {
  InstructionsPageTab,
  KnowledgeFolderPanelState,
} from "@/lib/instructions-tabs-dom";

export function mapResolvedTab(tab: ResolvedInstructionsTab): InstructionsPageTab {
  return {
    id: tab.id,
    type: tab.type,
    queryParam: tab.queryParam,
    label: tab.label,
    panelTestId: tab.panelTestId,
    html: tab.html,
    embedUrl: tab.embedUrl,
    rootPath: tab.rootPath,
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

function attachKnowledgeState(
  tab: InstructionsPageTab,
  locale: Locale,
  pathParam: string | undefined,
  docParam: string | undefined,
): InstructionsPageTab {
  if (tab.type !== "internal_page_folder" || !tab.rootPath) {
    return tab;
  }

  const segments = parseKnowledgePathParam(pathParam);
  const pathError = validateKnowledgePathSegments(segments);
  const doc = docParam?.trim() || null;

  const state: KnowledgeFolderPanelState = {
    folderSegments: segments,
    doc,
    listing: null,
    articleHtml: null,
    error: pathError,
  };

  if (pathError) {
    return { ...tab, knowledge: state };
  }

  if (doc) {
    const article = resolveKnowledgeArticle(
      tab.rootPath,
      segments,
      doc,
      locale,
    );
    if (!article.ok) {
      return {
        ...tab,
        knowledge: { ...state, error: article.error },
      };
    }
    return {
      ...tab,
      knowledge: {
        ...state,
        articleHtml: article.article.html,
        error: null,
      },
    };
  }

  const listing = resolveKnowledgeFolderListing(
    tab.rootPath,
    segments,
    locale,
  );
  if (!listing.ok) {
    return {
      ...tab,
      knowledge: { ...state, error: listing.error },
    };
  }

  const folderTitle =
    listing.listing.folderTitle ??
    (segments.length === 0 ? tab.label : null);

  return {
    ...tab,
    knowledge: {
      ...state,
      listing: { ...listing.listing, folderTitle },
      error: null,
    },
  };
}

export function buildInstructionsPageModel(
  locale: Locale,
  tabParam?: string,
  pathParam?: string,
  docParam?: string,
): {
  tabs: InstructionsPageTab[];
  activeQueryParam: string;
} {
  const resolved = resolveInstructionsTabs(locale);
  const tabs = resolved.tabs.map(mapResolvedTab);
  const activeQueryParam = resolveActiveTabQueryParam(tabParam, tabs);

  const enriched = tabs.map((tab) => {
    if (tab.queryParam !== activeQueryParam) {
      return tab;
    }
    if (tab.type === "internal_page_folder") {
      return attachKnowledgeState(tab, locale, pathParam, docParam);
    }
    return tab;
  });

  return {
    tabs: enriched,
    activeQueryParam,
  };
}
