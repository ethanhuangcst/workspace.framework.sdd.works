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
