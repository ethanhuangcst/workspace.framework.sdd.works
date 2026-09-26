import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InstructionsPage } from "./InstructionsPage";
import type { Locale } from "@/i18n/t";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: (event: { preventDefault: () => void }) => void;
  }) => (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
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

const SECRET_COPY: Record<
  Locale,
  { hint: string; button: string }
> = {
  en: {
    hint: "Enter the name of the secret, example: sdd-trial-googlemaps",
    button: "Get secret",
  },
  "zh-Hans": {
    hint: "输入要获得的密钥名称，例如：sdd-trial-googlemaps",
    button: "获取密钥",
  },
  "zh-Hant": {
    hint: "輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps",
    button: "獲取密鑰",
  },
};

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

  it("should_list_install_and_update_tools_without_list_versions", () => {
    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    const tools = document.getElementById("tools");
    expect(tools).toBeTruthy();
    expect(tools!.textContent).toContain("sdd_install_framework");
    expect(tools!.textContent).toContain("sdd_update_framework");
    expect(tools!.textContent).not.toContain("sdd_list_versions");
  });

  it("should_switch_to_features_tab_and_list_ethan", () => {
    render(
      <InstructionsPage
        locale="en"
        onLocaleChange={() => undefined}
        featuresHtml={`
          <h2>Features</h2>
          <h3>Agents</h3>
          <ul><li><span class="feature-name">ethan</span><span class="feature-desc">The scrum-master agent for this service.</span></li></ul>
          <h3>Skills</h3>
          <ul><li><span class="feature-name">sdd-atdd</span><span class="feature-desc">Acceptance Test Driven Development.</span></li></ul>
          <h3>Rules</h3>
          <ul><li><span class="feature-name">dod.mdc</span><span class="feature-desc">Definition of Done.</span></li></ul>
          <h2>Artifacts</h2>
          <ul><li><span class="feature-name">product-backlog.md</span><span class="feature-desc">Product Backlog.</span></li></ul>
        `}
      />,
    );

    expect(screen.getByTestId("panel-features")).not.toBeVisible();
    expect(screen.getByTestId("guide-tab-features")).toHaveAttribute(
      "aria-selected",
      "false",
    );

    fireEvent.click(screen.getByTestId("guide-tab-features"));

    expect(screen.getByTestId("guide-tab-features")).toHaveAttribute(
      "href",
      "/?tab=features",
    );
    expect(screen.getByTestId("guide-tab-features")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByTestId("panel-features")).toBeVisible();
    expect(screen.getByText("ethan")).toBeInTheDocument();
    expect(
      screen.getByText("The scrum-master agent for this service."),
    ).toBeInTheDocument();
    expect(screen.getByText("sdd-atdd")).toBeInTheDocument();
    expect(screen.getByText("dod.mdc")).toBeInTheDocument();
    expect(screen.getByText("product-backlog.md")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("guide-tab-setup"));
    expect(screen.getByTestId("panel-features")).not.toBeVisible();
    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("should_show_secret_empty_when_name_is_blank", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.click(screen.getByTestId("secret-get"));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("secret-error")).toHaveTextContent(
      /Enter the name of the secret/i,
    );
    expect(screen.queryByTestId("secret-result")).not.toBeInTheDocument();
    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("secret-lookup")).toBeVisible();

    fetchSpy.mockRestore();
  });

  it("should_show_secret_value_in_code_block_when_lookup_succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ key_value: "plain-secret-value" }),
    } as Response);

    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.change(screen.getByTestId("secret-name"), {
      target: { value: "sdd-trial-googlemaps" },
    });
    fireEvent.click(screen.getByTestId("secret-get"));

    await waitFor(() => {
      expect(screen.getByTestId("secret-result")).toBeInTheDocument();
    });
    const result = screen.getByTestId("secret-result");
    expect(result).toHaveTextContent("plain-secret-value");
    expect(result).toHaveClass("codeblock");
    expect(result.closest(".secret-stack")).not.toBeNull();
    expect(screen.getByTestId("secret-result-copy")).toBeInTheDocument();
    expect(screen.queryByTestId("secret-error")).not.toBeInTheDocument();
    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
  });

  it("should_show_secret_missing_when_lookup_returns_not_found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        error: { key: "admin.guide.secret_missing" },
      }),
    } as Response);

    render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.change(screen.getByTestId("secret-name"), {
      target: { value: "add-trail-googlemaps" },
    });
    fireEvent.click(screen.getByTestId("secret-get"));

    await waitFor(() => {
      expect(screen.getByTestId("secret-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("secret-error")).toHaveTextContent(
      /No secret with that name/i,
    );
    expect(screen.getByTestId("secret-error").closest(".secret-stack")).not.toBeNull();
    expect(screen.queryByTestId("secret-result")).not.toBeInTheDocument();
    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
  });

  it("should_place_secret_form_after_tools_on_setup_tab", () => {
    const { container } = render(
      <InstructionsPage
        locale="en"
        onLocaleChange={() => undefined}
        featuresHtml="<h2>Features</h2><p>ethan</p>"
      />,
    );

    const tools = container.querySelector("#tools");
    const secret = container.querySelector("#setup-secret");
    const setupPanel = container.querySelector("#panel-setup");
    const featuresPanel = container.querySelector("#panel-features");
    expect(tools).not.toBeNull();
    expect(secret).not.toBeNull();
    expect(setupPanel?.querySelector("[data-testid='secret-lookup']")).not.toBeNull();
    expect(featuresPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(
      Boolean(
        tools &&
          secret &&
          Boolean(tools.compareDocumentPosition(secret) & Node.DOCUMENT_POSITION_FOLLOWING),
      ),
    ).toBe(true);
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
  });

  it("should_hide_secret_form_on_features_tab", () => {
    const { container } = render(
      <InstructionsPage locale="en" onLocaleChange={() => undefined} />,
    );

    expect(screen.getByTestId("secret-lookup")).toBeVisible();

    fireEvent.click(screen.getByTestId("guide-tab-features"));

    const featuresPanel = container.querySelector("#panel-features");
    expect(featuresPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(screen.getByTestId("secret-lookup")).not.toBeVisible();
  });

  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_resolve_secret_hint_and_button_when_locale_is_%s",
    (locale) => {
      render(
        <InstructionsPage locale={locale} onLocaleChange={() => undefined} />,
      );

      const copy = SECRET_COPY[locale];
      expect(screen.getByTestId("secret-name")).toHaveAttribute(
        "placeholder",
        copy.hint,
      );
      expect(screen.getByTestId("secret-get")).toHaveTextContent(copy.button);
    },
  );
});
