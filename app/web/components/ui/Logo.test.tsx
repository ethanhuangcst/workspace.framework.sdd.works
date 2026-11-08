import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("should_use_deployed_wordmark_with_718_by_256_intrinsics", () => {
    render(<Logo size="header" href="/admin/keys" />);
    const img = document.querySelector("img.logo-header-mark");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", expect.stringContaining("sdd-logo.png"));
    expect(img).toHaveAttribute("width", "718");
    expect(img).toHaveAttribute("height", "256");
    expect(img).toHaveClass("logo-header-mark");
  });
});
