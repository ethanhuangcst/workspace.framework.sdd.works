import { t, type Locale } from "../../i18n/t";

export type SiteFooterProps = {
  locale: Locale;
  className?: string;
};

export function SiteFooter({ locale, className }: SiteFooterProps) {
  return (
    <footer className={className ? `site-footer ${className}` : "site-footer"}>
      <p>{t(locale, "admin.footer.copyright")}</p>
    </footer>
  );
}
