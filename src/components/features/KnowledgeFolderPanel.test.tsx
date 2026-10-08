import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KnowledgeFolderPanel } from "./KnowledgeFolderPanel";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("KnowledgeFolderPanel", () => {
  it("should_show_path_trail_at_root_without_folder_h2_or_back", () => {
    render(
      <KnowledgeFolderPanel
        locale="en"
        queryParam="knowledge"
        rootPath="content/knowledge"
        folderSegments={[]}
        doc={null}
        listing={{
          folderTitle: "Knowledge",
          entries: [
            {
              kind: "file",
              id: "invoke-agents",
              label: "How to invoke custom agents",
              open: "same_tab",
            },
          ],
          sourceLocale: "en",
        }}
        articleHtml={null}
        error={null}
      />,
    );

    expect(screen.getByTestId("knowledge-path")).toBeTruthy();
    expect(screen.getByText("knowledge")).toBeTruthy();
    expect(screen.queryByTestId("knowledge-back")).toBeNull();
    expect(screen.queryByTestId("knowledge-folder-title")).toBeNull();
    expect(screen.getByTestId("knowledge-list")).toBeTruthy();
  });

  it("should_show_linked_path_prefix_on_subfolder_list", () => {
    render(
      <KnowledgeFolderPanel
        locale="en"
        queryParam="knowledge"
        rootPath="content/knowledge"
        folderSegments={["archived"]}
        doc={null}
        listing={{
          folderTitle: "Archived",
          entries: [],
          sourceLocale: "en",
        }}
        articleHtml={null}
        error={null}
      />,
    );

    const rootLink = screen.getByRole("link", { name: "knowledge" });
    expect(rootLink.getAttribute("href")).toBe("/?tab=knowledge");
    expect(screen.getByText("archived")).toBeTruthy();
    expect(screen.queryByTestId("knowledge-folder-title")).toBeNull();
  });

  it("should_use_guide_md_body_prose_for_article_view", () => {
    render(
      <KnowledgeFolderPanel
        locale="en"
        queryParam="knowledge"
        rootPath="content/knowledge"
        folderSegments={[]}
        doc="invoke-agents"
        listing={null}
        articleHtml="<h1>Title</h1><p>Body</p>"
        error={null}
      />,
    );

    const body = screen.getByTestId("knowledge-article-body");
    expect(body.className).toContain("guide-md-body--prose");
    expect(body.className).toContain("guide-section");
    expect(screen.getByText("invoke-agents")).toBeTruthy();
  });
});
