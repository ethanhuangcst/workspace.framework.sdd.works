import Link from "next/link";
import { t, type Locale } from "@/i18n/t";
import { SDD_LEARN_SITE_URL } from "@/lib/sdd-works-learn-url";

export function LearnScrumEmbedPanel({
  locale,
  embedUrl,
}: {
  locale: Locale;
  embedUrl: string;
}) {
  return (
    <section className="learn-embed" data-testid="learn-scrum-embed">
      <p className="learn-embed-intro">{t(locale, "admin.guide.learn_scrum_intro")}</p>
      <iframe
        className="learn-embed-frame"
        data-testid="learn-scrum-iframe"
        src={embedUrl}
        title={t(locale, "admin.guide.learn_scrum_iframe_title")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="learn-embed-fallback">
        <Link href={SDD_LEARN_SITE_URL} target="_blank" rel="noopener noreferrer">
          {t(locale, "admin.guide.learn_scrum_open_external")}
        </Link>
      </p>
    </section>
  );
}
