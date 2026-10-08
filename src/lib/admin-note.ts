import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveCachedVersion } from "@/core/sync/cache";
import { renderPortalMarkdown } from "@/lib/features-catalog";

const PACKAGE_ADMIN_NOTE = join(process.cwd(), "src/content/.admin-note.md");

export type AdminNoteSource = "cache" | "package";

/** Fenced blocks → file codeblock with Copy affordance (ADR-117). */
export function postProcessAdminNoteHtml(html: string): string {
  return html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_match, lang: string, inner: string) => {
      const tag = lang === "json" ? "json" : lang;
      return `<div class="codeblock codeblock--file">
<div class="codeblock-head">
<span class="codeblock-tag">${tag}</span>
<button type="button" class="codeblock-copy" data-copy-from-pre="true">Copy</button>
</div>
<pre class="codeblock-text mono">${inner}</pre>
</div>`;
    },
  );
}

export function renderAdminNoteMarkdown(markdown: string): string {
  return postProcessAdminNoteHtml(renderPortalMarkdown(markdown).trim());
}

export function readAdminNote():
  | { html: string; source: AdminNoteSource }
  | null {
  const cached = resolveCachedVersion();
  if ("unpackedPath" in cached) {
    const cachePath = join(cached.unpackedPath, "content", ".admin-note.md");
    if (existsSync(cachePath)) {
      const markdown = readFileSync(cachePath, "utf8");
      return { html: renderAdminNoteMarkdown(markdown), source: "cache" };
    }
  }

  if (existsSync(PACKAGE_ADMIN_NOTE)) {
    const markdown = readFileSync(PACKAGE_ADMIN_NOTE, "utf8");
    return { html: renderAdminNoteMarkdown(markdown), source: "package" };
  }

  return null;
}
