import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { InstructionsPage } from "./InstructionsPage";
import type { Locale } from "@/i18n/t";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={props.alt ?? ""}
      src={typeof props.src === "string" ? props.src : ""}
    />
  ),
}));

const SETUP_SENTENCE =
  "Fetch and execute the setup instructions from https://framework.sdd.works/setup";

const STDIO_FRAGMENT = '"command": "${userHome}/.sdd/sdd-mcp"';

afterEach(() => {
  cleanup();
});

describe("InstructionsPage", () => {
  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_copy_setup_sentence_when_locale_is_%s",
    async (locale) => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
      });

      render(
        <InstructionsPage locale={locale} onLocaleChange={() => undefined} />,
      );

      fireEvent.click(screen.getByTestId("copy-setup-prompt"));

      expect(writeText).toHaveBeenCalledWith(SETUP_SENTENCE);
    },
  );

  it("should_show_stdio_mcp_sample_on_setup_tab", () => {
    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    const mcp = screen.getByTestId("copy-mcp-config");
    expect(mcp.closest(".codeblock")?.textContent).toContain(STDIO_FRAGMENT);
    expect(mcp.closest(".codeblock")?.textContent).toContain(
      "SDD_SERVER_URL",
    );
    expect(screen.queryByText(/curl/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Back to home/i)).not.toBeInTheDocument();
  });

  it("should_switch_to_features_tab_and_list_ethan", () => {
    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    expect(screen.getByTestId("panel-features")).not.toBeVisible();

    fireEvent.click(screen.getByTestId("guide-tab-features"));

    expect(screen.getByTestId("panel-features")).toBeVisible();
    expect(screen.getByText("ethan")).toBeInTheDocument();
    expect(
      screen.getByText("The scrum-master agent for this service."),
    ).toBeInTheDocument();
    expect(screen.getByText("sdd-atdd")).toBeInTheDocument();
    expect(screen.getByText("dod.mdc")).toBeInTheDocument();
    expect(screen.getByText("product-backlog.md")).toBeInTheDocument();
  });

  it("should_not_reveal_secret_value_when_get_secret_is_submitted", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.click(screen.getByTestId("guide-tab-features"));
    fireEvent.change(screen.getByTestId("secret-name"), {
      target: { value: "sdd-trial-googlemaps" },
    });
    fireEvent.click(screen.getByTestId("secret-get"));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.queryByText(/sk-|api[_-]?key|plaintext/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("secret-name")).toHaveValue(
      "sdd-trial-googlemaps",
    );

    fetchSpy.mockRestore();
  });
});
