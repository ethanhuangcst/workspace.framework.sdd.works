import { readFileSync } from "node:fs";
import { join } from "node:path";

export type McpIcon = {
  src: string;
  mimeType: string;
  sizes?: string[];
};

function pngDataUri(relativePublicPath: string): string {
  const abs = join(process.cwd(), "public", relativePublicPath);
  const buf = readFileSync(abs);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/**
 * Same brand assets as the admin portal (`public/sdd-logo.png`, `sdd-mark.png`).
 * Data URIs so Cursor can render icons without fetching the portal host.
 */
export function getMcpBrandIcons(): McpIcon[] {
  return [
    {
      src: pngDataUri("sdd-mark.png"),
      mimeType: "image/png",
      sizes: ["128x128"],
    },
    {
      src: pngDataUri("sdd-logo.png"),
      mimeType: "image/png",
      sizes: ["663x369"],
    },
  ];
}

export function getMcpWebsiteUrl(): string {
  return (
    process.env.PUBLIC_BASE_URL?.trim() || "https://framework.sdd.works"
  );
}
