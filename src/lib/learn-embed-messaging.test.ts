import { describe, expect, it } from "vitest";
import {
  LEARN_EMBED_HEIGHT_MESSAGE_TYPE,
  computeLearnEmbedFallbackHeightPx,
  estimateLearnEmbedGridHeightPx,
  isAllowedLearnEmbedMessageOrigin,
  parseLearnEmbedHeightMessage,
} from "./learn-embed-messaging";

describe("learn-embed-messaging", () => {
  it("should_accept_sdd_works_origins", () => {
    expect(isAllowedLearnEmbedMessageOrigin("https://sdd.works")).toBe(true);
    expect(isAllowedLearnEmbedMessageOrigin("https://www.sdd.works")).toBe(true);
  });

  it("should_reject_other_origins", () => {
    expect(isAllowedLearnEmbedMessageOrigin("https://evil.example")).toBe(false);
    expect(isAllowedLearnEmbedMessageOrigin("not-a-url")).toBe(false);
  });

  it("should_parse_valid_height_message", () => {
    expect(
      parseLearnEmbedHeightMessage({
        type: LEARN_EMBED_HEIGHT_MESSAGE_TYPE,
        height: 640.2,
      }),
    ).toBe(641);
  });

  it("should_reject_invalid_height_message", () => {
    expect(parseLearnEmbedHeightMessage({ type: "other", height: 100 })).toBeNull();
    expect(
      parseLearnEmbedHeightMessage({
        type: LEARN_EMBED_HEIGHT_MESSAGE_TYPE,
        height: 0,
      }),
    ).toBeNull();
  });

  it("should_compute_fallback_height_capped_at_max", () => {
    expect(computeLearnEmbedFallbackHeightPx(2000)).toBe(720);
    expect(computeLearnEmbedFallbackHeightPx(600)).toBe(540);
  });

  it("should_estimate_grid_height_from_iframe_width", () => {
    expect(estimateLearnEmbedGridHeightPx(900)).toBe(838);
    expect(estimateLearnEmbedGridHeightPx(952)).toBe(886);
  });
});
