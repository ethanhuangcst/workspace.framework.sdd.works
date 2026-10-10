import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  BUNDLED_COMMIT_SHA,
  bundledPackDir,
  readBundledPack,
} from "./bundled-pack";

describe("bundled-pack", () => {
  it("should_read_bundled_pack_from_repo_workspace", () => {
    const ref = readBundledPack(process.cwd());
    expect(ref).not.toBeNull();
    expect(ref?.commitSha).toBe(BUNDLED_COMMIT_SHA);
    expect(existsSync(join(ref!.unpackedPath, "skills"))).toBe(true);
    expect(bundledPackDir(process.cwd())).toContain("pack.framework.sdd.works");
    const templatesNested = join(ref!.unpackedPath, "templates/framework.sdd.works");
    expect(existsSync(templatesNested)).toBe(true);
    expect(existsSync(join(templatesNested, "EN"))).toBe(true);
    expect(existsSync(join(templatesNested, "HanS"))).toBe(true);
    expect(existsSync(join(templatesNested, "HanT"))).toBe(true);
    expect(existsSync(join(templatesNested, "constants.json"))).toBe(true);
  });
});
