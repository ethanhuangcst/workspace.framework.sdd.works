import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InstructionsPage } from "./InstructionsPage";
import type { Locale } from "@/i18n/t";
import type { InstructionsPageTab } from "@/lib/instructions-tabs-page";
import {
  getManualMcpSample,
  getSetupManualPasteContent,
} from "@/lib/setup-manual";

const LEARN_EMBED_URL = "https://learn.sdd.works/en/learn-embedded/";
const LEARN_SITE_URL = "https://learn.sdd.works";

const LEARN_TAB_LABEL: Record<Locale, string> = {
  en: "Learn Scrum in SDD",
  "zh-Hans": "学习 Scrum in SDD",
  "zh-Hant": "學習 Scrum in SDD",
};

const TAB_LABELS: Record<
  Locale,
  { setup: string; features: string; scrum: string; learn: string }
> = {
  en: {
    setup: "Setup",
    features: "Features",
    scrum: "Scrum in SDD",
    learn: "Learn Scrum in SDD",
  },
  "zh-Hans": {
    setup: "安装",
    features: "功能",
    scrum: "Scrum in SDD",
    learn: "学习 Scrum in SDD",
  },
  "zh-Hant": {
    setup: "安裝",
    features: "功能",
    scrum: "Scrum in SDD",
    learn: "學習 Scrum in SDD",
  },
};

function defaultGuideTabs(options?: {
  featuresHtml?: string;
  scrumHtml?: string;
  includeLearn?: boolean;
  locale?: Locale;
}): InstructionsPageTab[] {
  const labels = TAB_LABELS[options?.locale ?? "en"];
  const tabs: InstructionsPageTab[] = [
    {
      type: "code",
      id: "setup",
      queryParam: "setup",
      label: labels.setup,
      panelTestId: "panel-setup",
    },
  ];
  if (options?.includeLearn) {
    tabs.push({
      type: "embedded_external_page",
      id: "learn-scrum-in-sdd",
      queryParam: "learn-scrum-in-sdd",
      label: labels.learn,
      panelTestId: "panel-learn-scrum",
      embedUrl: LEARN_EMBED_URL,
    });
  }
  tabs.push(
    {
      type: "content",
      id: "features",
      queryParam: "features",
      label: labels.features,
      panelTestId: "panel-features",
      html: options?.featuresHtml ?? "",
    },
    {
      type: "content",
      id: "scrum-in-sdd",
      queryParam: "scrum-in-sdd",
      label: labels.scrum,
      panelTestId: "panel-scrum",
      html: options?.scrumHtml ?? "",
    },
  );
  return tabs;
}

const SETUP_SENTENCE =
  "Fetch and execute the setup instructions from https://sdd.works/setup";
const DEFAULT_PASTE = {
  setupPromptSentence: SETUP_SENTENCE,
  manualPaste: getSetupManualPasteContent(),
} as const;

function renderGuide(
  props: Omit<
    ComponentProps<typeof InstructionsPage>,
    | "tabs"
    | "onLocaleChange"
    | "setupPromptSentence"
    | "manualPaste"
  > & {
    featuresHtml?: string;
    scrumHtml?: string;
    includeLearn?: boolean;
    onLocaleChange?: () => void;
    setupPromptSentence?: string;
    manualPaste?: typeof DEFAULT_PASTE.manualPaste;
  },
) {
  const {
    featuresHtml,
    scrumHtml,
    includeLearn,
    onLocaleChange,
    setupPromptSentence = DEFAULT_PASTE.setupPromptSentence,
    manualPaste = DEFAULT_PASTE.manualPaste,
    ...rest
  } = props;
  return render(
    <InstructionsPage
      onLocaleChange={onLocaleChange ?? (() => undefined)}
      tabs={defaultGuideTabs({
        featuresHtml,
        scrumHtml,
        includeLearn,
        locale: rest.locale,
      })}
      setupPromptSentence={setupPromptSentence}
      manualPaste={manualPaste}
      {...rest}
    />,
  );
}

/** Learn tab open; secret lookup lives on that panel (ADR-115). */
function renderGuideOnLearnTab(
  props: Parameters<typeof renderGuide>[0],
) {
  return renderGuide({
    includeLearn: true,
    activeQueryParam: "learn-scrum-in-sdd",
    ...props,
  });
}

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

const SECRET_COPY: Record<
  Locale,
  { hint: string; button: string; copy: string }
> = {
  en: {
    hint: "Enter the name of the secret, example: sdd-trial-googlemaps",
    button: "Get secret",
    copy: "Copy secret",
  },
  "zh-Hans": {
    hint: "输入要获得的密钥名称，例如：sdd-trial-googlemaps",
    button: "获取密钥",
    copy: "复制密钥",
  },
  "zh-Hant": {
    hint: "輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps",
    button: "獲取密鑰",
    copy: "複製密鑰",
  },
};

beforeEach(() => {
  class ResizeObserverMock {
    observe() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
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

      renderGuide({ locale });

      fireEvent.click(screen.getByTestId("copy-setup-prompt"));

      expect(writeText).toHaveBeenCalledWith(SETUP_SENTENCE);
    },
  );

  it("should_pin_hero_and_tabs_in_guide_sticky_when_guide_renders", () => {
    renderGuide({ locale: "en" });

    const sticky = screen.getByTestId("guide-sticky");
    expect(sticky.querySelector(".guide-hero")).toBeTruthy();
    expect(sticky.querySelector(".guide-tabs")).toBeTruthy();
    expect(sticky.querySelector(".shell-locale")).toBeNull();
    expect(document.querySelector(".shell-locale")).toBeTruthy();
  });

  it("should_not_show_lite_copy_on_setup_tab", () => {
    renderGuide({ locale: "en" });
    expect(screen.queryByTestId("copy-lite-setup-prompt")).toBeNull();
  });

  it("should_not_show_node_setup_block_on_setup_tab", () => {
    renderGuide({ locale: "en" });
    expect(screen.queryByTestId("copy-node-setup-prompt")).toBeNull();
    expect(screen.queryByText(/Install Node\.js first/i)).not.toBeInTheDocument();
  });

  it("should_show_manual_mcp_block_on_setup_tab", () => {
    renderGuide({ locale: "en" });

    expect(screen.getByTestId("setup-manual")).toBeInTheDocument();
    expect(screen.getByTestId("copy-manual-mcp")).toBeInTheDocument();
    expect(screen.getByText(/Manual setup/i)).toBeInTheDocument();
    expect(screen.getByTestId("copy-manual-claude")).toBeInTheDocument();
    expect(screen.getByTestId("copy-manual-codex")).toBeInTheDocument();
    expect(screen.getByText("~/.cursor/mcp.json")).toBeInTheDocument();
    expect(screen.getByText("~/.codebuddy/mcp.json")).toBeInTheDocument();
    expect(
      screen.getByText(
        "~/Library/Application Support/Trae CN/User/mcp.json",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("copy-mcp-config")).toBeNull();
    expect(screen.queryByText(/curl/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Back to home/i)).not.toBeInTheDocument();
    expect(document.getElementById("tools")).toBeNull();
  });

  it("should_show_manual_clients_in_order_with_url_only_sample", () => {
    renderGuide({ locale: "en" });

    const manual = screen.getByTestId("setup-manual");
    const clients = manual.querySelectorAll(".setup-manual-client");
    expect(Array.from(clients).map((el) => el.textContent)).toEqual([
      "Claude Code",
      "Codex",
      "Cursor",
      "CodeBuddy CN / WorkBuddy CN",
      "TRAE CN",
    ]);

    const sample = getManualMcpSample();
    expect(manual.querySelector(".codeblock--file pre")?.textContent).toBe(
      sample,
    );
    expect(sample).not.toMatch(/"command"/);
  });

  it("should_show_update_command_above_agents_without_tools_table", () => {
    renderGuide({ locale: "en" });

    expect(document.getElementById("tools")).toBeNull();
    expect(screen.getByTestId("setup-update-preface")).toBeTruthy();
    expect(screen.queryByTestId("copy-update-cmd")).toBeNull();
    const agents = document.getElementById("agents");
    expect(agents!.textContent).toContain("sdd_update_framework");
    expect(agents!.textContent).not.toContain("sdd_list_versions");
    const setup = document.getElementById("setup");
    expect(setup!.textContent).toContain("sdd_install_framework");
  });

  it("should_switch_to_features_tab_and_list_ethan", () => {
    renderGuide({
      locale: "en",
      featuresHtml: `
          <h2>Features</h2>
          <h3>Agents</h3>
          <ul><li><span class="feature-name">ethan</span><span class="feature-desc">The scrum-master agent for this service.</span></li></ul>
          <h3>Skills</h3>
          <ul><li><span class="feature-name">sdd-atdd</span><span class="feature-desc">Acceptance Test Driven Development.</span></li></ul>
          <h3>Rules</h3>
          <ul><li><span class="feature-name">sdd-dod.mdc</span><span class="feature-desc">Definition of Done.</span></li></ul>
          <h2>Artifacts</h2>
          <ul><li><span class="feature-name">product-backlog.md</span><span class="feature-desc">Product Backlog.</span></li></ul>
        `,
    });

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
    expect(screen.getByText("sdd-dod.mdc")).toBeInTheDocument();
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

    renderGuideOnLearnTab({ locale: "en" });

    fireEvent.click(screen.getByTestId("secret-get"));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByTestId("secret-error")).toHaveTextContent(
      /Enter the name of the secret/i,
    );
    expect(screen.queryByTestId("secret-result")).not.toBeInTheDocument();
    expect(screen.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
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

    renderGuideOnLearnTab({ locale: "en" });

    fireEvent.change(screen.getByTestId("secret-name"), {
      target: { value: "sdd-trial-googlemaps" },
    });
    fireEvent.click(screen.getByTestId("secret-get"));

    await waitFor(() => {
      expect(screen.getByTestId("secret-result")).toBeInTheDocument();
    });
    const result = screen.getByTestId("secret-result");
    expect(result).toHaveTextContent("plain-secret-value");
    expect(result).toHaveClass("secret-result-row", "secret-row-grid");
    expect(result.querySelector(".secret-result-value")).toHaveClass("input-box");
    expect(result.querySelector(".secret-result-value")).toHaveTextContent(
      "plain-secret-value",
    );
    expect(result.closest(".secret-stack")).not.toBeNull();
    expect(screen.getByTestId("secret-result-copy")).toHaveTextContent(
      "Copy secret",
    );
    expect(screen.queryByTestId("secret-error")).not.toBeInTheDocument();
    expect(screen.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
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

    renderGuideOnLearnTab({ locale: "en" });

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
    expect(screen.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
  });

  it("should_place_secret_form_on_learn_tab_between_iframe_and_fallback", () => {
    const { container } = renderGuideOnLearnTab({
      locale: "en",
      featuresHtml: "<h2>Features</h2><p>ethan</p>",
    });

    const setupPanel = container.querySelector("#panel-setup");
    const featuresPanel = container.querySelector("#panel-features");
    const learnPanel = container.querySelector("#panel-learn-scrum");
    const embed = screen.getByTestId("learn-scrum-embed");
    const iframe = screen.getByTestId("learn-scrum-iframe");
    const secret = container.querySelector("#learn-secret");
    const fallbackLink = screen.getByRole("link", {
      name: "Open learn.sdd.works in a new tab.",
    });

    expect(setupPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(featuresPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(learnPanel?.querySelector("[data-testid='secret-lookup']")).not.toBeNull();
    expect(secret).not.toBeNull();
    expect(
      Boolean(
        iframe.compareDocumentPosition(fallbackLink) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
    expect(
      Boolean(
        fallbackLink.compareDocumentPosition(secret!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
    expect(embed.contains(secret)).toBe(true);
    expect(screen.getByTestId("secret-lookup")).toBeVisible();
  });

  it("should_hide_secret_form_on_features_tab", () => {
    const { container } = renderGuideOnLearnTab({ locale: "en" });

    expect(screen.getByTestId("secret-lookup")).toBeVisible();

    fireEvent.click(screen.getByTestId("guide-tab-features"));

    const featuresPanel = container.querySelector("#panel-features");
    const setupPanel = container.querySelector("#panel-setup");
    expect(featuresPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(setupPanel?.querySelector("[data-testid='secret-lookup']")).toBeNull();
    expect(screen.getByTestId("secret-lookup")).not.toBeVisible();
  });

  it("should_switch_to_scrum_tab_after_features_with_label", () => {
    renderGuide({
      locale: "en",
      includeLearn: true,
      featuresHtml: "<h2>Features</h2>",
      scrumHtml:
        "<h1>Scrum in SDD</h1><p>Part I summary.</p><ul><li>KEEP — classic roles stay.</li></ul>",
    });

    const setup = screen.getByTestId("guide-tab-setup");
    const features = screen.getByTestId("guide-tab-features");
    const scrum = screen.getByTestId("guide-tab-scrum");
    expect(setup.compareDocumentPosition(features) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(features.compareDocumentPosition(scrum) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(scrum).toHaveTextContent("Scrum in SDD");
    expect(screen.getByTestId("panel-scrum")).not.toBeVisible();

    fireEvent.click(scrum);

    expect(scrum).toHaveAttribute("href", "/?tab=scrum-in-sdd");
    expect(scrum).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("panel-scrum")).toBeVisible();
    expect(screen.getByTestId("scrum-body")).toHaveTextContent("Part I summary");
    expect(screen.getByTestId("scrum-body").querySelector(".feature-name")).toBeNull();
    expect(screen.getByTestId("scrum-body")).toHaveTextContent(
      "KEEP — classic roles stay.",
    );
    expect(screen.getByTestId("secret-lookup")).not.toBeVisible();
  });

  it("should_use_guide_md_body_classes_on_content_tab_articles", () => {
    renderGuide({
      locale: "en",
      featuresHtml: "<h2>Features</h2>",
      scrumHtml: "<h1>Scrum</h1>",
    });

    expect(screen.getByTestId("features-body").className).toBe(
      "guide-section guide-md-body guide-md-body--catalog",
    );
    expect(screen.getByTestId("scrum-body").className).toBe(
      "guide-section guide-md-body guide-md-body--prose",
    );
  });

  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_keep_scrum_tab_label_untranslated_when_locale_is_%s",
    (locale) => {
      renderGuide({ locale });
      expect(screen.getByTestId("guide-tab-scrum")).toHaveTextContent(
        "Scrum in SDD",
      );
    },
  );

  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_resolve_secret_hint_and_button_when_locale_is_%s",
    (locale) => {
      renderGuideOnLearnTab({ locale });

      const copy = SECRET_COPY[locale];
      expect(screen.getByTestId("secret-name")).toHaveAttribute(
        "placeholder",
        copy.hint,
      );
      expect(screen.getByTestId("secret-get")).toHaveTextContent(copy.button);
    },
  );

  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_resolve_secret_copy_when_lookup_shows_result_and_locale_is_%s",
    async (locale) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ key_value: "plain-secret-value" }),
      } as Response);

      renderGuideOnLearnTab({ locale });

      fireEvent.change(screen.getByTestId("secret-name"), {
        target: { value: "sdd-trial-googlemaps" },
      });
      fireEvent.click(screen.getByTestId("secret-get"));

      await waitFor(() => {
        expect(screen.getByTestId("secret-result-copy")).toBeInTheDocument();
      });
      expect(screen.getByTestId("secret-result-copy")).toHaveTextContent(
        SECRET_COPY[locale].copy,
      );
    },
  );

  it.each(["en", "zh-Hans", "zh-Hant"] as Locale[])(
    "should_embed_learn_scrum_url_when_tab_is_learn_scrum_and_locale_is_%s",
    (locale) => {
      renderGuide({
        locale,
        includeLearn: true,
        activeQueryParam: "learn-scrum-in-sdd",
      });

      const learnTab = screen.getByTestId("guide-tab-learn-scrum");
      expect(learnTab).toHaveAttribute("aria-selected", "true");
      expect(learnTab).toHaveTextContent(LEARN_TAB_LABEL[locale]);
      expect(learnTab).toHaveAttribute(
        "href",
        "/?tab=learn-scrum-in-sdd",
      );

      const iframe = screen.getByTestId("learn-scrum-iframe");
      expect(iframe).toHaveAttribute("src", LEARN_EMBED_URL);
      expect(iframe).toHaveClass("learn-embed-frame");
      expect(screen.getByTestId("panel-learn-scrum")).toBeVisible();
      expect(screen.getByTestId("panel-setup")).not.toBeVisible();

      const fallback = screen
        .getByTestId("learn-scrum-embed")
        .querySelector("a[target='_blank']");
      expect(fallback).not.toBeNull();
      expect(fallback).toHaveAttribute("href", LEARN_SITE_URL);
      expect(fallback).toHaveAttribute("rel", "noopener noreferrer");
    },
  );

  it("should_hide_learn_scrum_panel_when_default_setup_tab", () => {
    renderGuide({ locale: "en", includeLearn: true });

    expect(screen.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByTestId("panel-setup")).toBeVisible();
    expect(screen.getByTestId("panel-learn-scrum")).not.toBeVisible();
  });
});
