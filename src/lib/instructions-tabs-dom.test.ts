import { describe, expect, it } from "vitest";
import { contentBodyClassName } from "./instructions-tabs-dom";

describe("contentBodyClassName", () => {
  it("should_apply_catalog_modifier_for_features", () => {
    expect(contentBodyClassName("features")).toBe(
      "guide-section guide-md-body guide-md-body--catalog",
    );
  });

  it("should_apply_prose_modifier_for_scrum_and_other_content_tabs", () => {
    expect(contentBodyClassName("scrum-in-sdd")).toBe(
      "guide-section guide-md-body guide-md-body--prose",
    );
    expect(contentBodyClassName("invoke-agents")).toBe(
      "guide-section guide-md-body guide-md-body--prose",
    );
  });

  it("should_not_use_legacy_body_presentation_classes", () => {
    for (const id of ["features", "scrum-in-sdd", "invoke-agents"]) {
      const cls = contentBodyClassName(id);
      expect(cls).not.toContain("features-body");
      expect(cls).not.toContain("scrum-body");
      expect(cls).not.toContain("portal-content-body");
    }
  });
});
