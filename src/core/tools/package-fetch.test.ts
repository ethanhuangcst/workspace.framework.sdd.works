import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fetchPackage, setPackageFetchForTests } from "./package-fetch";

afterEach(() => {
  setPackageFetchForTests(null);
});

describe("fetchPackage", () => {
  it("should_return_package_from_override", async () => {
    const pkg = mkdtempSync(join(tmpdir(), "sdd-fetch-pkg-"));
    mkdirSync(join(pkg, "skills/tdd"), { recursive: true });
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "# tdd\n");
    setPackageFetchForTests(async () => ({
      version: "v1.0.0",
      commitSha: "sha-v1",
      tempDir: pkg,
    }));

    const result = await fetchPackage("v1.0.0");
    expect("code" in result).toBe(false);
    if (!("code" in result)) {
      expect(result.version).toBe("v1.0.0");
      expect(result.commitSha).toBe("sha-v1");
    }
  });

  it("should_return_package_unavailable_from_override", async () => {
    setPackageFetchForTests(async () => ({
      code: "package_unavailable",
      message: "server down",
    }));
    const result = await fetchPackage();
    expect(result).toEqual({ code: "package_unavailable", message: "server down" });
  });
});
