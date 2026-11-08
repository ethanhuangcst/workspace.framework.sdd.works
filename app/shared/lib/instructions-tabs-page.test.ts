import { describe, expect, it } from "vitest";
import {
  buildInstructionsPageModel,
  resolveActiveTabQueryParam,
  type InstructionsPageTab,
} from "./instructions-tabs-page";

const tabs: InstructionsPageTab[] = [
  {
    type: "code",
    id: "setup",
    queryParam: "setup",
    label: "Setup",
    panelTestId: "panel-setup",
  },
  {
    type: "content",
    id: "features",
    queryParam: "features",
    label: "Features",
    panelTestId: "panel-features",
  },
];

describe("resolveActiveTabQueryParam", () => {
  it("should_default_to_setup_when_tab_param_missing", () => {
    expect(resolveActiveTabQueryParam(undefined, tabs)).toBe("setup");
  });

  it("should_default_to_setup_when_tab_param_unknown", () => {
    expect(resolveActiveTabQueryParam("knowledge", tabs)).toBe("setup");
  });

  it("should_select_matching_tab_query_param", () => {
    expect(resolveActiveTabQueryParam("features", tabs)).toBe("features");
  });
});

describe("buildInstructionsPageModel — knowledge folder", () => {
  it("should_attach_listing_when_knowledge_tab_selected", () => {
    const { tabs, activeQueryParam } = buildInstructionsPageModel(
      "en",
      "knowledge",
    );
    expect(activeQueryParam).toBe("knowledge");
    const knowledge = tabs.find((t) => t.id === "knowledge");
    expect(knowledge?.type).toBe("internal_page_folder");
    expect(knowledge?.knowledge?.listing?.entries.length).toBeGreaterThan(0);
    expect(knowledge?.knowledge?.doc).toBeNull();
  });

  it("should_attach_article_html_when_doc_query_present", () => {
    const { tabs } = buildInstructionsPageModel(
      "en",
      "knowledge",
      undefined,
      "invoke-agents",
    );
    const knowledge = tabs.find((t) => t.id === "knowledge");
    expect(knowledge?.knowledge?.doc).toBe("invoke-agents");
    expect(knowledge?.knowledge?.articleHtml).toContain("custom agent");
    expect(knowledge?.knowledge?.listing).toBeNull();
  });
});
