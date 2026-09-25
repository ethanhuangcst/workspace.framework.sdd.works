import Link from "next/link";
import { t, type Locale } from "../../i18n/t";

export type SiteFooterProps = {
  locale: Locale;
  className?: string;
  /** Guide landing: Admin portal link + copyright, right-aligned. */
  variant?: "default" | "guide";
};

export function SiteFooter({
  locale,
  className,
  variant = "default",
}: SiteFooterProps) {
  const classes = ["site-footer"];
  if (variant === "guide") classes.push("site-footer--guide");
  if (className) classes.push(className);

  if (variant === "guide") {
    return (
      <footer className={classes.join(" ")}>
        <div className="site-footer-inner">
          <Link
            className="site-footer-admin"
            href="/login"
            data-testid="footer-admin-portal"
          >
            {t(locale, "admin.footer.admin_portal")}
          </Link>
          <p>{t(locale, "admin.footer.copyright")}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={classes.join(" ")}>
      <p>{t(locale, "admin.footer.copyright")}</p>
    </footer>
  );
}
