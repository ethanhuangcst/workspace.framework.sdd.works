import { NextResponse } from "next/server";
import { requireAdminApi } from "@shared/auth/require-admin-api";
import { readAdminNote } from "@shared/lib/admin-note";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return auth.response;
  }

  const note = readAdminNote();
  if (!note) {
    return NextResponse.json(
      { error: { key: "admin.framework.admin_note_error" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ html: note.html, source: note.source });
}
