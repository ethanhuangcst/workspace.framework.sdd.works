import { Resend } from "resend";
import { t, type Locale } from "@/i18n/t";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(key);
}

export async function sendResetMail(params: {
  to: string;
  locale: Locale;
  setUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const from = process.env.MAIL_FROM;
  if (!from) {
    return { ok: false, error: "MAIL_FROM is not configured" };
  }

  const subject = t(params.locale, "admin.mail.reset.subject");
  const heading = t(params.locale, "admin.mail.reset.heading");
  const body = t(params.locale, "admin.mail.reset.intro");
  const detail = t(params.locale, "admin.mail.reset.detail");
  const cta = t(params.locale, "admin.mail.reset.cta");
  const footer = t(params.locale, "admin.mail.reset.ignore");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;background:#fafafa;color:#0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;">
    <tr><td style="padding:24px;text-align:center;">
      <img src="${process.env.PUBLIC_BASE_URL ?? ""}/sdd-mark.png" alt="" width="48" height="48" style="display:block;margin:0 auto 16px;" />
      <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 12px;line-height:1.5;">${escapeHtml(body)}</p>
      <p style="margin:0 0 20px;line-height:1.5;">${escapeHtml(detail)}</p>
      <a href="${escapeAttr(params.setUrl)}" style="display:inline-block;padding:10px 16px;background:#0a0a0a;color:#fff;text-decoration:none;">${escapeHtml(cta)}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#666;">${escapeHtml(footer)}</p>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject,
      html,
    });
    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "send_failed",
    };
  }
}

export async function sendInviteMail(params: {
  to: string;
  locale: Locale;
  inviteUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const from = process.env.MAIL_FROM;
  if (!from) {
    return { ok: false, error: "MAIL_FROM is not configured" };
  }

  const subject = t(params.locale, "admin.mail.invite.subject");
  const heading = t(params.locale, "admin.mail.invite.heading");
  const body = t(params.locale, "admin.mail.invite.intro");
  const detail = t(params.locale, "admin.mail.invite.detail");
  const cta = t(params.locale, "admin.mail.invite.cta");
  const footer = t(params.locale, "admin.mail.invite.ignore");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;background:#fafafa;color:#0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;">
    <tr><td style="padding:24px;text-align:center;">
      <img src="${process.env.PUBLIC_BASE_URL ?? ""}/sdd-mark.png" alt="" width="48" height="48" style="display:block;margin:0 auto 16px;" />
      <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 12px;line-height:1.5;">${escapeHtml(body)}</p>
      <p style="margin:0 0 20px;line-height:1.5;">${escapeHtml(detail)}</p>
      <a href="${escapeAttr(params.inviteUrl)}" style="display:inline-block;padding:10px 16px;background:#0a0a0a;color:#fff;text-decoration:none;">${escapeHtml(cta)}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#666;">${escapeHtml(footer)}</p>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject,
      html,
    });
    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "send_failed",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
