import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPageClient } from "@/components/features/LoginPageClient";
import { readSessionValue, SESSION_COOKIE } from "@/auth/session";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";

export default async function LoginRoute() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const payload = readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (payload) {
    const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
    if (admin && admin.status === "ACTIVE" && admin.sessionVersion === payload.v) {
      if (!admin.passwordHash) {
        redirect("/set-password?reason=password_required");
      }
      redirect("/admin/keys");
    }
  }

  return <LoginPageClient initialLocale={locale} />;
}
