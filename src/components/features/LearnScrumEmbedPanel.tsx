"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/i18n/t";
import {
  LEARN_EMBED_FALLBACK_TIMEOUT_MS,
  estimateLearnEmbedGridHeightPx,
  isAllowedLearnEmbedMessageOrigin,
  parseLearnEmbedHeightMessage,
} from "@/lib/learn-embed-messaging";
import { SDD_LEARN_SITE_URL } from "@/lib/sdd-works-learn-url";

export function LearnScrumEmbedPanel({
  locale,
  embedUrl,
}: {
  locale: Locale;
  embedUrl: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const receivedHeightRef = useRef(false);
  const [frameHeightPx, setFrameHeightPx] = useState<number | null>(null);

  const applyHeight = useCallback((heightPx: number) => {
    receivedHeightRef.current = true;
    setFrameHeightPx(heightPx);
  }, []);

  const applyWidthEstimate = useCallback(() => {
    if (receivedHeightRef.current) return;
    const width = iframeRef.current?.getBoundingClientRect().width ?? 0;
    setFrameHeightPx(estimateLearnEmbedGridHeightPx(width));
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isAllowedLearnEmbedMessageOrigin(event.origin)) return;
      const heightPx = parseLearnEmbedHeightMessage(event.data);
      if (heightPx !== null) applyHeight(heightPx);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [applyHeight]);

  useEffect(() => {
    receivedHeightRef.current = false;
    setFrameHeightPx(null);
    const iframe = iframeRef.current;
    if (!iframe) return;

    applyWidthEstimate();
    const observer = new ResizeObserver(() => applyWidthEstimate());
    observer.observe(iframe);

    const timer = window.setTimeout(() => {
      if (!receivedHeightRef.current) applyWidthEstimate();
    }, LEARN_EMBED_FALLBACK_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [embedUrl, applyWidthEstimate]);

  return (
    <section className="learn-embed" data-testid="learn-scrum-embed">
      <p className="learn-embed-intro">{t(locale, "admin.guide.learn_scrum_intro")}</p>
      <iframe
        ref={iframeRef}
        className="learn-embed-frame"
        data-testid="learn-scrum-iframe"
        src={embedUrl}
        title={t(locale, "admin.guide.learn_scrum_iframe_title")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={frameHeightPx !== null ? { height: `${frameHeightPx}px` } : undefined}
      />
      <p className="learn-embed-fallback">
        <Link href={SDD_LEARN_SITE_URL} target="_blank" rel="noopener noreferrer">
          {t(locale, "admin.guide.learn_scrum_open_external")}
        </Link>
      </p>
    </section>
  );
}
