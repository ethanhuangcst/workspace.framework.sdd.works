export const LITE_INSTALL_RECEIPT_FILENAME = ".sdd-lite-installed.example.json";

const ALLOWED_KEYS = [
  "schema_version",
  "package_version",
  "package_commit",
  "installed_at",
  "files",
] as const;

export type LiteInstallReceipt = {
  schema_version: 1;
  package_version: string;
  package_commit: string;
  installed_at: string;
  files: string[];
};

export type LiteInstallServerList = {
  package_version: string;
  package_commit: string;
  files: string[];
};

export type ValidateLiteInstallReceiptResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export type PlanLiteInstallReceiptResult =
  | { kind: "already_up_to_date" }
  | {
      kind: "plan";
      downloads: string[];
      deletes: string[];
      writeReceipt: boolean;
    };

function isSortedCopy(values: string[]): boolean {
  const sorted = [...values].sort((a, b) => a.localeCompare(b));
  return values.every((v, i) => v === sorted[i]);
}

function isAllowedFilePath(path: string): boolean {
  return path.startsWith("skills/") || path.startsWith("rules/");
}

function isIso8601(value: string): boolean {
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function sameStringList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function validateLiteInstallReceipt(
  input: unknown,
): ValidateLiteInstallReceiptResult {
  const errors: string[] = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["receipt must be a JSON object"] };
  }

  const record = input as Record<string, unknown>;

  if ("pack_complete" in record) {
    errors.push("forbidden key: pack_complete");
  }

  for (const key of Object.keys(record)) {
    if (!ALLOWED_KEYS.includes(key as (typeof ALLOWED_KEYS)[number])) {
      errors.push(`unexpected key: ${key}`);
    }
  }

  const schemaVersion = record.schema_version;
  if (schemaVersion !== 1) {
    errors.push("schema_version must be 1");
  }

  for (const field of [
    "package_version",
    "package_commit",
    "installed_at",
  ] as const) {
    if (typeof record[field] !== "string" || record[field] === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (
    typeof record.installed_at === "string" &&
    record.installed_at !== "" &&
    !isIso8601(record.installed_at)
  ) {
    errors.push("installed_at must be ISO-8601");
  }

  const filesRaw = record.files;
  if (!Array.isArray(filesRaw)) {
    errors.push("files must be an array");
  } else {
    for (const entry of filesRaw) {
      if (typeof entry !== "string") {
        errors.push("files entries must be strings");
        break;
      }
      if (!isAllowedFilePath(entry)) {
        errors.push(`files entry must start with skills/ or rules/: ${entry}`);
      }
    }
    if (filesRaw.every((e) => typeof e === "string") && !isSortedCopy(filesRaw)) {
      errors.push("files must be sorted");
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}

function receiptMatchesServer(
  previous: LiteInstallReceipt,
  next: LiteInstallServerList,
): boolean {
  return (
    previous.package_version === next.package_version &&
    previous.package_commit === next.package_commit &&
    sameStringList(previous.files, [...next.files].sort((a, b) => a.localeCompare(b)))
  );
}

export function planLiteInstallReceipt(
  previous: LiteInstallReceipt | null,
  next: LiteInstallServerList,
  filesOnDisk: ReadonlySet<string>,
): PlanLiteInstallReceiptResult {
  const nextFiles = [...next.files].sort((a, b) => a.localeCompare(b));

  if (
    previous !== null &&
    receiptMatchesServer(previous, { ...next, files: nextFiles }) &&
    nextFiles.every((p) => filesOnDisk.has(p))
  ) {
    return { kind: "already_up_to_date" };
  }

  const previousFiles = previous?.files ?? [];
  const nextSet = new Set(nextFiles);
  const deletes = previousFiles.filter((p) => !nextSet.has(p));
  const downloads = [...nextFiles];
  const writeReceipt = nextFiles.every((p) => filesOnDisk.has(p));

  return {
    kind: "plan",
    downloads,
    deletes,
    writeReceipt,
  };
}
