import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
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

  it("should_not_render_learn_scrum_intro", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    expect(screen.queryByText(/Complete these nine modules/i)).toBeNull();
  });

  it("should_order_iframe_fallback_then_secret_lookup", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const embed = screen.getByTestId("learn-scrum-embed");
    const iframe = screen.getByTestId("learn-scrum-iframe");
    const secret = embed.querySelector("#learn-secret");
    const fallback = screen.getByRole("link", {
      name: "Open learn.sdd.works in a new tab.",
    });
    expect(secret).not.toBeNull();
    expect(within(embed).getByTestId("secret-lookup")).toBeInTheDocument();
    expect(
      Boolean(
        iframe.compareDocumentPosition(fallback) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
    expect(
      Boolean(
        fallback.compareDocumentPosition(secret!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
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

  it("should_cap_oversized_postMessage_height_using_iframe_width", () => {
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
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://sdd.works",
          data: { type: LEARN_EMBED_HEIGHT_MESSAGE_TYPE, height: 2400 },
        }),
      );
    });
    expect(iframe).toHaveStyle({
      height: `${estimateLearnEmbedGridHeightPx(900) + 16}px`,
    });
    expect(estimateLearnEmbedGridHeightPx(900)).toBe(675);
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

  it("should_show_skeleton_until_iframe_loads", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    const host = screen.getByTestId("learn-scrum-iframe").parentElement;
    expect(host).toHaveClass("learn-embed-frame-host");
    expect(host).toHaveAttribute("aria-busy", "true");
    expect(host).toHaveAttribute("aria-label", "Loading course");
    const skeleton = screen.getByTestId("learn-embed-loading");
    expect(skeleton.querySelectorAll(".learn-embed-skeleton-cell")).toHaveLength(
      9,
    );
    expect(screen.getByTestId("learn-embed-loading-indicator")).toBeInTheDocument();
    const iframe = screen.getByTestId("learn-scrum-iframe");
    expect(iframe).toHaveClass("learn-embed-frame--loading");
    fireEvent.load(iframe);
    expect(screen.queryByTestId("learn-embed-loading")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("learn-embed-loading-indicator"),
    ).not.toBeInTheDocument();
    expect(iframe).not.toHaveClass("learn-embed-frame--loading");
    expect(host).toHaveAttribute("aria-busy", "false");
  });

  it("should_show_skeleton_again_when_embed_url_changes", () => {
    const { rerender } = render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    fireEvent.load(screen.getByTestId("learn-scrum-iframe"));
    expect(screen.queryByTestId("learn-embed-loading")).not.toBeInTheDocument();

    rerender(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/?v=2"
      />,
    );
    expect(screen.getByTestId("learn-embed-loading")).toBeInTheDocument();
  });

  it("should_keep_fallback_and_secret_visible_while_loading", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn-embedded/"
      />,
    );
    expect(screen.getByTestId("learn-embed-loading")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Open learn.sdd.works in a new tab.",
      }),
    ).toBeVisible();
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
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
