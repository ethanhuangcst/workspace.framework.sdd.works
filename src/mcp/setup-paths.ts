/** Public setup URL paths (ADR-061). Imported by next.config and tests. */

export const SETUP_REDIRECTS = [
  {
    source: "/agent-setup",
    destination: "/setup",
    permanent: false as const,
  },
];

export const SETUP_REWRITES = [
  {
    source: "/setup",
    destination: "/api/agent-setup",
  },
];
