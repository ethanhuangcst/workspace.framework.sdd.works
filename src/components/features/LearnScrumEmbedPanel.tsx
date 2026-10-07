import Link from "next/link";
import { t, type Locale } from "@/i18n/t";

export function LearnScrumEmbedPanel({
  locale,
  embedUrl,
}: {
  locale: Locale;
  embedUrl: string;
}) {
  const learnUrl = embedUrl;

  return (
    <section className="learn-embed" data-testid="learn-scrum-embed">
      <p className="learn-embed-intro">{t(locale, "admin.guide.learn_scrum_intro")}</p>
      <iframe
        className="learn-embed-frame"
        data-testid="learn-scrum-iframe"
        src={learnUrl}
        title={t(locale, "admin.guide.learn_scrum_iframe_title")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="learn-embed-fallback">
        {t(locale, "admin.guide.learn_scrum_open_external_prefix")}{" "}
        <Link href={learnUrl} target="_blank" rel="noopener noreferrer">
          {t(locale, "admin.guide.learn_scrum_open_external_link")}
        </Link>
      </p>
    </section>
  );
}
