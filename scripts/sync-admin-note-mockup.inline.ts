import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPortalMarkdown } from "../src/lib/features-catalog";

/** Match mockup / portal: fenced blocks become codeblock--file with Copy. */
function postProcessAdminNoteHtml(html: string): string {
  return html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_match, lang: string, inner: string) => {
      const tag = lang === "json" ? "json" : lang;
      return `<div class="codeblock codeblock--file">
<div class="codeblock-head">
<span class="codeblock-tag">${tag}</span>
<button type="button" class="codeblock-copy" data-copy-from-pre="true" data-i18n="admin.keys.copy">Copy</button>
</div>
<pre class="codeblock-text mono">${inner}</pre>
</div>`;
    },
  );
}

const root = process.cwd();
const md = readFileSync(join(root, "src/content/.admin-note.md"), "utf8");
const html = postProcessAdminNoteHtml(renderPortalMarkdown(md).trim());
const samplePath = join(
  root,
  "specs/admin-portal/ui-mockup/assets/samples/admin-note-body.html",
);
writeFileSync(samplePath, `${html}\n`);

const pagePath = join(root, "specs/admin-portal/ui-mockup/12-framework.html");
const page = readFileSync(pagePath, "utf8");
const startMarker =
  '            data-testid="framework-admin-note-body"\n          >\n';
const endMarker =
  '\n          </article>\n        </div>\n        <div class="floating-frame__actions">';
const startIdx = page.indexOf(startMarker);
const endIdx = page.indexOf(endMarker, startIdx + startMarker.length);
if (startIdx === -1 || endIdx === -1) {
  console.error(
    "sync-admin-note-mockup: could not find injection markers in 12-framework.html",
  );
  process.exit(1);
}
const contentStart = startIdx + startMarker.length;
const indent = "          ";

/** Indent HTML for the article; never prefix lines inside `<pre>` (preserves code indent). */
function indentArticleHtml(body: string, pad: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let inPre = false;
  for (const line of lines) {
    const opensPre = !inPre && line.includes("<pre");
    const closesPre = inPre && line.includes("</pre>");
    if (!inPre) {
      out.push(line ? pad + line : line);
      if (opensPre) inPre = !line.includes("</pre>");
      continue;
    }
    if (closesPre) {
      out.push(line.trim() ? pad + line.trim() : line);
      inPre = false;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

const indentedBody = indentArticleHtml(html, indent);
writeFileSync(
  pagePath,
  page.slice(0, contentStart) + indentedBody + page.slice(endIdx),
);
console.log("sync-admin-note-mockup: ok");
