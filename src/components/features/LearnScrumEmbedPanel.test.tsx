import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LEARN_EMBED_FALLBACK_TIMEOUT_MS,
  LEARN_EMBED_HEIGHT_MESSAGE_TYPE,
  estimateLearnEmbedGridHeightPx,
} from "@/lib/learn-embed-messaging";
import { LearnScrumEmbedPanel } from "./LearnScrumEmbedPanel";

describe("LearnScrumEmbedPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    class ResizeObserverMock {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  function iframeInLatestPanel() {
    const panel = screen.getAllByTestId("learn-scrum-embed").at(-1)!;
    return within(panel).getByTestId("learn-scrum-iframe");
  }

  it("should_render_iframe_with_locale_learn_url", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const iframe = screen.getByTestId("learn-scrum-iframe");
    expect(iframe).toHaveAttribute("src", "https://sdd.works/en/learn-embedded/");
    expect(iframe).toHaveClass("learn-embed-frame");
    expect(screen.getByTestId("learn-scrum-embed")).toBeInTheDocument();
    const fallback = screen.getByRole("link", {
      name: "Open learn.sdd.works in a new tab.",
    });
    expect(fallback).toHaveAttribute("href", "https://learn.sdd.works");
    expect(fallback).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should_set_iframe_height_from_postMessage", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const iframe = iframeInLatestPanel();
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://sdd.works",
          data: { type: LEARN_EMBED_HEIGHT_MESSAGE_TYPE, height: 640 },
        }),
      );
    });
    expect(iframe).toHaveStyle({ height: "640px" });
  });

  it("should_ignore_postMessage_from_disallowed_origin", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const iframe = iframeInLatestPanel();
    const before = iframe.style.height;
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://evil.example",
          data: { type: LEARN_EMBED_HEIGHT_MESSAGE_TYPE, height: 640 },
        }),
      );
    });
    expect(iframe.style.height).toBe(before);
    expect(iframe.style.height).not.toBe("640px");
  });

  it("should_apply_width_based_height_when_iframe_has_layout_width", () => {
    const getBoundingClientRect = vi.fn(() => ({
      width: 900,
      height: 0,
      top: 0,
      left: 0,
      right: 900,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
    vi.spyOn(HTMLIFrameElement.prototype, "getBoundingClientRect").mockImplementation(
      getBoundingClientRect,
    );
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const iframe = iframeInLatestPanel();
    expect(iframe).toHaveStyle({
      height: `${estimateLearnEmbedGridHeightPx(900)}px`,
    });
  });
});
