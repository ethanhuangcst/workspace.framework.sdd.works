import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResetPasswordPage } from "./ResetPasswordPage";

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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ResetPasswordPage", () => {
  it("should_show_back_to_login_when_reset_mail_is_sent", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(
      <ResetPasswordPage locale="en" onLocaleChange={() => undefined} />,
    );

    expect(screen.queryByTestId("reset-back-login")).not.toBeInTheDocument();
    expect(screen.getByText("Back to home")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("reset-email"), {
      target: { value: "e2e-admin@ethanhuang.com" },
    });
    fireEvent.click(screen.getByTestId("reset-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("reset-back-login")).toBeInTheDocument();
    });
    expect(screen.getByTestId("reset-back-login")).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByTestId("reset-back-login")).toHaveTextContent(
      "Back to login",
    );
    expect(screen.queryByTestId("reset-submit")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/A reset mail will be sent/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /If that email is an admin account, a reset mail is on its way\. Check inbox and junk\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/e2e-admin@ethanhuang\.com/i),
    ).not.toBeInTheDocument();
  });

  it("should_keep_form_and_show_error_when_reset_request_fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ error: { key: "errors.reset_mail_send_failed" } }),
    } as Response);

    render(
      <ResetPasswordPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.change(screen.getByTestId("reset-email"), {
      target: { value: "e2e-admin@ethanhuang.com" },
    });
    fireEvent.click(screen.getByTestId("reset-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("reset-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("reset-error")).toHaveTextContent(
      /Could not send the reset mail/i,
    );
    expect(screen.getByTestId("reset-submit")).toBeInTheDocument();
    expect(screen.queryByTestId("reset-back-login")).not.toBeInTheDocument();
  });

  it("should_show_error_when_fetch_throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    render(
      <ResetPasswordPage locale="en" onLocaleChange={() => undefined} />,
    );

    fireEvent.change(screen.getByTestId("reset-email"), {
      target: { value: "e2e-admin@ethanhuang.com" },
    });
    fireEvent.click(screen.getByTestId("reset-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("reset-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("reset-submit")).toBeInTheDocument();
  });
});
