import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPageClient } from "@web/components/features/LoginPageClient";
import { readSessionValue, SESSION_COOKIE } from "@shared/auth/session";
import { getRequestLocale } from "@shared/lib/request-locale";
import { db } from "@shared/lib/db";

export default async function LoginRoute() {
  const locale = await getRequestLocale();
  const cookieStore = await cookies();
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
