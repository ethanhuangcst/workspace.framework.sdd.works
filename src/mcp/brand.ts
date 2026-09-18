import { readFileSync } from "node:fs";
import { join } from "node:path";

export type McpIcon = {
  src: string;
  mimeType: string;
  sizes?: string[];
};

function pngDataUri(relativePublicPath: string): string | null {
  try {
    const abs = join(process.cwd(), "public", relativePublicPath);
    const buf = readFileSync(abs);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Same brand assets as the admin portal (`public/sdd-logo.png`, `sdd-mark.png`).
 * Data URIs so Cursor can render icons without fetching the portal host.
 */
export function getMcpBrandIcons(): McpIcon[] {
  const icons: McpIcon[] = [];
  const mark = pngDataUri("sdd-mark.png");
  const logo = pngDataUri("sdd-logo.png");
  if (mark) {
    icons.push({ src: mark, mimeType: "image/png", sizes: ["128x128"] });
  }
  if (logo) {
    icons.push({ src: logo, mimeType: "image/png", sizes: ["663x369"] });
  }
  return icons;
}

export function getMcpWebsiteUrl(): string {
  return (
    process.env.PUBLIC_BASE_URL?.trim() || "https://framework.sdd.works"
  );
}
