import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn(async () => ({ data: { id: "1" }, error: null }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { t } from "@/i18n/t";
import { sendInviteMail, sendResetMail } from "./resend";

beforeEach(() => {
  send.mockClear();
  process.env.RESEND_API_KEY = "re_test";
  process.env.MAIL_FROM = "test@example.com";
  process.env.PUBLIC_BASE_URL = "http://localhost:3040";
});

describe("mail catalogs follow the resolved locale", () => {
  it("should_use_zh_Hans_invite_keys_when_locale_is_zh_Hans", async () => {
    const result = await sendInviteMail({
      to: "admin@example.com",
      locale: "zh-Hans",
      inviteUrl: "http://localhost:3040/accept-invite?token=test",
    });
    expect(result.ok).toBe(true);
    const payload = send.mock.calls[0]?.[0] as { subject: string; html: string };
    expect(payload.subject).toBe(t("zh-Hans", "admin.mail.invite.subject"));
    expect(payload.html).toContain(t("zh-Hans", "admin.mail.invite.heading"));
    expect(payload.subject).not.toBe(t("en", "admin.mail.invite.subject"));
  });

  it("should_use_zh_Hant_reset_keys_when_locale_is_zh_Hant", async () => {
    const result = await sendResetMail({
      to: "admin@example.com",
      locale: "zh-Hant",
      setUrl: "http://localhost:3040/set-password?token=test",
    });
    expect(result.ok).toBe(true);
    const payload = send.mock.calls[0]?.[0] as { subject: string; html: string };
    expect(payload.subject).toBe(t("zh-Hant", "admin.mail.reset.subject"));
    expect(payload.html).toContain(t("zh-Hant", "admin.mail.reset.heading"));
    expect(payload.subject).not.toBe(t("en", "admin.mail.reset.subject"));
  });
});
