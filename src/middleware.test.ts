import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware", () => {
  it("should_redirect_framework_host_to_sdd_works", () => {
    const request = new NextRequest("https://framework.sdd.works/instructions?tab=setup", {
      headers: { host: "framework.sdd.works" },
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://sdd.works/instructions?tab=setup",
    );
  });

  it("should_pass_through_sdd_works", () => {
    const request = new NextRequest("https://sdd.works/", {
      headers: { host: "sdd.works" },
    });
    const response = middleware(request);
    expect(response.status).toBe(200);
  });

  it("should_redirect_www_host_to_apex", () => {
    const request = new NextRequest("https://www.sdd.works/instructions?tab=setup", {
      headers: { host: "www.sdd.works" },
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://sdd.works/instructions?tab=setup",
    );
  });

  it("should_redirect_legacy_wordpress_home_to_portal", () => {
    const request = new NextRequest("https://sdd.works/en/home-en", {
      headers: { host: "sdd.works" },
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe("https://sdd.works/instructions");
  });

  it("should_redirect_legacy_wordpress_home_with_trailing_slash", () => {
    const request = new NextRequest("https://sdd.works/en/home-en/?x=1", {
      headers: { host: "sdd.works" },
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://sdd.works/instructions?x=1",
    );
  });

  it("should_pass_through_api_on_framework_host", () => {
    const request = new NextRequest(
      "https://framework.sdd.works/api/github/webhook",
      {
        method: "POST",
        headers: { host: "framework.sdd.works" },
      },
    );
    const response = middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("should_pass_through_api_package_get_on_framework_host", () => {
    const request = new NextRequest(
      "https://framework.sdd.works/api/sdd/package?version=latest",
      {
        headers: { host: "framework.sdd.works" },
      },
    );
    const response = middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
