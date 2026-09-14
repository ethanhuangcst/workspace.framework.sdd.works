import { t, type Locale } from "../../i18n/t";

export type SkipLinkProps = {
  locale: Locale;
  href?: string;
};

export function SkipLink({ locale, href = "#content" }: SkipLinkProps) {
  return (
    <a className="sr-only" href={href}>
      {t(locale, "admin.a11y.skip")}
    </a>
  );
}
