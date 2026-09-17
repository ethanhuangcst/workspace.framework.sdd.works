import { afterEach, describe, expect, it } from "vitest";
import {
  extractBearerToken,
  isAuthorizedMcpBearer,
} from "./auth";

describe("MCP bearer auth (ADR-049 / ADR-050)", () => {
  afterEach(() => {
    delete process.env.MCP_AUTH_TOKEN;
  });

  it("should_accept_matching_bearer", () => {
    process.env.MCP_AUTH_TOKEN = "secret-token";
    expect(isAuthorizedMcpBearer("Bearer secret-token")).toBe(true);
  });

  it("should_reject_missing_or_wrong_bearer_when_token_configured", () => {
    process.env.MCP_AUTH_TOKEN = "secret-token";
    expect(isAuthorizedMcpBearer(undefined)).toBe(false);
    expect(isAuthorizedMcpBearer("Bearer wrong")).toBe(false);
    expect(extractBearerToken("Token x")).toBeNull();
  });

  it("should_allow_all_when_token_unset", () => {
    delete process.env.MCP_AUTH_TOKEN;
    expect(isAuthorizedMcpBearer(undefined)).toBe(true);
    expect(isAuthorizedMcpBearer("Bearer anything")).toBe(true);
  });
});
