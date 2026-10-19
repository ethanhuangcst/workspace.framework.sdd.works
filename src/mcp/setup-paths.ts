/** Public setup URL paths (ADR-061). Imported by next.config and tests. */

export const SETUP_REDIRECTS = [
  {
    source: "/agent-setup",
    destination: "/setup",
    permanent: false as const,
  },
  {
    source: "/setup/install",
    destination: "/lite/install",
    permanent: false as const,
  },
];

export const SETUP_REWRITES = [
  {
    source: "/install",
    destination: "/api/agent-setup/install-full",
  },
  {
    source: "/lite/install",
    destination: "/api/agent-setup/install",
  },
  {
    source: "/setup/node",
    destination: "/api/agent-setup/node",
  },
  {
    source: "/setup",
    destination: "/api/agent-setup",
  },
];
