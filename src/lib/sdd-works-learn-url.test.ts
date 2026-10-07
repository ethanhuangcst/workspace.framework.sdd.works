import { describe, expect, it } from "vitest";
import { sddWorksLearnUrl } from "./sdd-works-learn-url";

describe("sddWorksLearnUrl", () => {
  it("should_use_the_english_learn_page_for_every_locale", () => {
    const url = "https://sdd.works/en/learn/";
    expect(sddWorksLearnUrl("en")).toBe(url);
    expect(sddWorksLearnUrl("zh-Hans")).toBe(url);
    expect(sddWorksLearnUrl("zh-Hant")).toBe(url);
  });
});
