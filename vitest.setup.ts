import "@testing-library/jest-dom/vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Keep unit tests from writing fake tarballs into the dev server's .data cache.
process.env.SDD_PACKAGE_CACHE_DIR =
  process.env.SDD_PACKAGE_CACHE_DIR ??
  mkdtempSync(join(tmpdir(), "sdd-vitest-cache-"));
