import { describe, expect, it } from "vitest";
import {
  resolveActiveTabQueryParam,
  type InstructionsPageTab,
} from "./instructions-tabs-page";

const tabs: InstructionsPageTab[] = [
  {
    type: "code",
    id: "setup",
    queryParam: "setup",
    labelKey: "admin.guide.tab_setup",
    panelTestId: "panel-setup",
  },
  {
    type: "content",
    id: "features",
    queryParam: "features",
    labelKey: "admin.guide.tab_features",
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
