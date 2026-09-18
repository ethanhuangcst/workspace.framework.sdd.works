import { t, type Locale } from "@/i18n/t";

const LEAD_KEYS = [
  "admin.keys.lead_1",
  "admin.keys.lead_2",
  "admin.keys.lead_3",
] as const;

/** Keys page lead — mockup bullet list (`admin.keys.lead_1`–`lead_3`). */
export function KeysLeadList({ locale }: { locale: Locale }) {
  return (
    <ul className="page-head-lead keys-lead-list">
      {LEAD_KEYS.map((key) => (
        <li key={key}>{t(locale, key)}</li>
      ))}
    </ul>
  );
}
