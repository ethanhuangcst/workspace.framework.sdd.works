import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearnScrumEmbedPanel } from "./LearnScrumEmbedPanel";

describe("LearnScrumEmbedPanel", () => {
  it("should_render_iframe_with_locale_learn_url", () => {
    render(
      <LearnScrumEmbedPanel
        locale="en"
        embedUrl="https://sdd.works/en/learn/"
      />,
    );
    const iframe = screen.getByTestId("learn-scrum-iframe");
    expect(iframe).toHaveAttribute("src", "https://sdd.works/en/learn/");
    expect(screen.getByTestId("learn-scrum-embed")).toBeInTheDocument();
  });
});
