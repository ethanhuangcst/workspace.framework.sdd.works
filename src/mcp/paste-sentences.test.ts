import { afterEach, describe, expect, it } from "vitest";
import {
  resetPasteSentencesCacheForTests,
  resolvePasteSentence,
} from "./paste-sentences";

describe("paste-sentences", () => {
  afterEach(() => {
    resetPasteSentencesCacheForTests();
  });

  it("should_resolve_lite_install_for_sdd_works_origin", () => {
    expect(resolvePasteSentence("lite_install", "https://sdd.works")).toBe(
      "Fetch and execute the setup instructions from https://sdd.works/setup/install",
    );
  });

  it("should_resolve_node_prerequisite_for_sdd_works_origin", () => {
    expect(resolvePasteSentence("node_prerequisite", "https://sdd.works")).toBe(
      "Fetch and execute the setup instructions from https://sdd.works/setup/node",
    );
  });
});
