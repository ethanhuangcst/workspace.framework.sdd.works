import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { FrameworkView } from "./FrameworkView";

const frameworkPayload = {
  empty: false,
  source: "github.com/fixture/sdd-framework",
  tree: [
    {
      name: "skills/",
      type: "dir" as const,
      children: [{ name: "tdd/", type: "dir" as const, children: [] }],
    },
  ],
};

const adminNoteHtml =
  '<h1 id="notes">Notes to the admin</h1><div class="codeblock codeblock--file"><pre class="codeblock-text mono">{}</pre></div>';

function mockFetch(handlers: {
  framework?: Response | (() => Response | Promise<Response>);
  adminNote?: Response | (() => Response | Promise<Response>);
}) {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/api/admin/framework")) {
      const handler = handlers.framework ?? Response.json(frameworkPayload);
      return typeof handler === "function" ? handler() : Promise.resolve(handler);
    }
    if (url.includes("/api/admin/admin-note")) {
      const handler =
        handlers.adminNote ??
        Response.json({ html: adminNoteHtml, source: "package" });
      return typeof handler === "function" ? handler() : Promise.resolve(handler);
    }
    return Promise.resolve(new Response(null, { status: 404 }));
  });
}

describe("FrameworkView admin note", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch({}));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should_show_admin_note_control_when_repo_block_visible", async () => {
    render(<FrameworkView locale="en" />);
    await waitFor(() => {
      expect(screen.getByTestId("framework-source")).toBeVisible();
    });
    expect(screen.getByTestId("framework-admin-note")).toHaveTextContent(
      "Admin note",
    );
  });

  it("should_open_dialog_with_prose_body_and_close_on_escape", async () => {
    render(<FrameworkView locale="en" />);
    await waitFor(() => {
      expect(screen.getByTestId("framework-admin-note")).toBeVisible();
    });

    fireEvent.click(screen.getByTestId("framework-admin-note"));

    await waitFor(() => {
      expect(screen.getByTestId("framework-admin-note-dialog")).toHaveClass(
        "is-open",
      );
    });

    const body = await screen.findByTestId("framework-admin-note-body");
    expect(body).toHaveClass("guide-section");
    expect(body).toHaveClass("guide-md-body--prose");
    expect(body.innerHTML).toContain("Notes to the admin");
    expect(body.innerHTML).toContain("codeblock--file");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(
        screen.getByTestId("framework-admin-note-dialog"),
      ).not.toHaveClass("is-open");
    });
  });

  it("should_show_error_callout_when_admin_note_fetch_fails", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        adminNote: new Response(null, { status: 404 }),
      }),
    );
    render(<FrameworkView locale="en" />);
    await waitFor(() => {
      expect(screen.getByTestId("framework-admin-note")).toBeVisible();
    });
    fireEvent.click(screen.getByTestId("framework-admin-note"));
    await waitFor(() => {
      expect(screen.getByTestId("framework-admin-note-error")).toBeVisible();
    });
  });
});
