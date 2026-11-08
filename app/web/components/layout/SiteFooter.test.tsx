import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./SiteFooter";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("SiteFooter", () => {
  afterEach(() => {
    cleanup();
  });

  it("should_open_admin_portal_in_new_tab_when_guide_variant", () => {
    render(<SiteFooter locale="en" variant="guide" />);
    const link = screen.getByTestId("footer-admin-portal");
    expect(link).toHaveAttribute("href", "/login");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should_omit_admin_portal_link_when_default_variant", () => {
    render(<SiteFooter locale="en" />);
    expect(screen.queryByTestId("footer-admin-portal")).toBeNull();
  });
});
