"use client";

import { FormEvent, useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/i18n/t";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

export type UserRow = {
  id: string;
  kind: "admin" | "invite";
  email: string;
  name: string | null;
  username: string | null;
  status: "active" | "pending";
  canDelete: boolean;
};

export function AdminAccountsClient({
  initialLocale,
  name,
  initialUsers,
}: {
  initialLocale: Locale;
  name: string;
  initialUsers: UserRow[];
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [tipKey, setTipKey] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<UserRow | null>(null);
  const [, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const data = (await res.json()) as { users: UserRow[] };
    setUsers(data.users);
  }, []);

  const onLocaleChange = useCallback((next: Locale) => {
    setLocale(next);
    startTransition(() => {
      void fetch("/api/admin/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
    });
  }, []);

  const onSignOut = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  async function onInvite(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    setTipKey(null);
    const res = await fetch("/api/admin/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { error?: { key: string } };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      return;
    }
    setEmail("");
    setTipKey("admin.users.invite_sent");
    await refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const targetId = pendingDelete.id;
    const res = await fetch(`/api/admin/users/${targetId}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { error?: { key: string } };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      setPendingDelete(null);
      return;
    }
    setPendingDelete(null);
    setUsers((prev) => prev.filter((u) => u.id !== targetId));
    await refresh();
  }

  return (
    <AppShell
      locale={locale}
      name={name}
      activeNav="admins"
      onLocaleChange={onLocaleChange}
      onSignOut={onSignOut}
    >
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.users.eyebrow")}</p>
        <p className="page-head-lead">{t(locale, "admin.users.lead")}</p>
        {errorKey ? (
          <p className="error" data-testid="users-error">
            {t(locale, errorKey)}
          </p>
        ) : null}
        {tipKey ? (
          <p className="tip" role="status" data-testid="users-tip">
            {t(locale, tipKey)}
          </p>
        ) : null}
        <form className="invite-row" onSubmit={onInvite}>
          <label className="invite-field">
            <span>{t(locale, "admin.users.email")}</span>
            <input
              className="input-box"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="invite-email"
              autoComplete="off"
            />
          </label>
          <Button type="submit" variant="page" data-testid="invite-submit">
            {t(locale, "admin.users.invite_submit")}
          </Button>
        </form>
      </div>

      <div className="table-wrap">
        <table data-testid="users-table">
          <thead>
            <tr>
              <th>{t(locale, "admin.users.col_name")}</th>
              <th>{t(locale, "admin.users.col_email")}</th>
              <th>{t(locale, "admin.users.col_status")}</th>
              <th>{t(locale, "admin.users.col_actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={`${row.kind}-${row.id}`} data-testid={`user-row-${row.id}`}>
                <td>
                  {row.name ??
                    row.username ??
                    t(locale, "admin.users.empty_name")}
                </td>
                <td className="mono">{row.email}</td>
                <td>
                  <span
                    className={
                      row.status === "active" ? "status is-on" : "status"
                    }
                  >
                    {t(
                      locale,
                      row.status === "active"
                        ? "admin.users.status_active"
                        : "admin.users.status_pending",
                    )}
                  </span>
                </td>
                <td>
                  {row.canDelete ? (
                    <button
                      type="button"
                      className="btn-text"
                      data-testid={
                        row.kind === "invite"
                          ? "delete-admin-invite"
                          : "delete-admin"
                      }
                      onClick={() => setPendingDelete(row)}
                    >
                      {t(locale, "admin.users.delete")}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={t(
          locale,
          pendingDelete?.kind === "invite"
            ? "admin.users.delete_invite_title"
            : "admin.users.delete_title",
        )}
        body={t(
          locale,
          pendingDelete?.kind === "invite"
            ? "admin.users.delete_invite_body"
            : "admin.users.delete_body",
        )}
        actions={
          <>
            <Button
              type="button"
              variant="text"
              onClick={() => setPendingDelete(null)}
            >
              {t(locale, "admin.common.cancel")}
            </Button>
            <Button
              type="button"
              data-testid="confirm-delete-user"
              onClick={() => void confirmDelete()}
            >
              {t(locale, "admin.users.delete_submit")}
            </Button>
          </>
        }
      />
    </AppShell>
  );
}
