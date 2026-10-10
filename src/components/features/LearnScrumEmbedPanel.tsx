"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/i18n/t";
import {
  LEARN_EMBED_FALLBACK_TIMEOUT_MS,
  LEARN_EMBED_GRID_COLS,
  LEARN_EMBED_GRID_ROWS,
  estimateLearnEmbedGridHeightPx,
  isAllowedLearnEmbedMessageOrigin,
  parseLearnEmbedHeightMessage,
  resolveLearnEmbedFrameHeightPx,
} from "@/lib/learn-embed-messaging";

const LEARN_EMBED_SKELETON_CELL_COUNT =
  LEARN_EMBED_GRID_ROWS * LEARN_EMBED_GRID_COLS;
import { SDD_LEARN_SITE_URL } from "@/lib/sdd-works-learn-url";
import { GuideSecretLookup } from "@/components/features/GuideSecretLookup";

export function LearnScrumEmbedPanel({
  locale,
  embedUrl,
}: {
  locale: Locale;
  embedUrl: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const receivedHeightRef = useRef(false);
  const postedHeightRef = useRef<number | null>(null);
  const [frameHeightPx, setFrameHeightPx] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const loadingLabel = t(locale, "admin.guide.learn_scrum_embed_loading");

  const syncFrameHeight = useCallback(() => {
    const width = iframeRef.current?.getBoundingClientRect().width ?? 0;
    if (receivedHeightRef.current && postedHeightRef.current !== null) {
      setFrameHeightPx(
        resolveLearnEmbedFrameHeightPx(postedHeightRef.current, width),
      );
      return;
    }
    if (!receivedHeightRef.current) {
      setFrameHeightPx(estimateLearnEmbedGridHeightPx(width));
    }
  }, []);

  const applyHeight = useCallback(
    (heightPx: number) => {
      receivedHeightRef.current = true;
      postedHeightRef.current = heightPx;
      syncFrameHeight();
    },
    [syncFrameHeight],
  );

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
    const iframe = iframeRef.current;
    if (!iframe) return;

    syncFrameHeight();
    const observer = new ResizeObserver(() => syncFrameHeight());
    observer.observe(iframe);

    const timer = window.setTimeout(() => {
      if (!receivedHeightRef.current) syncFrameHeight();
    }, LEARN_EMBED_FALLBACK_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [syncFrameHeight]);

  const frameHeightStyle =
    frameHeightPx !== null ? { height: `${frameHeightPx}px` } : undefined;

  return (
    <section className="learn-embed" data-testid="learn-scrum-embed">
      <div
        className="learn-embed-frame-host"
        aria-busy={!iframeLoaded}
        aria-label={loadingLabel}
        style={frameHeightStyle}
      >
        {!iframeLoaded ? (
          <>
            <div
              className="learn-embed-skeleton"
              data-testid="learn-embed-loading"
              aria-hidden="true"
            >
              {Array.from(
                { length: LEARN_EMBED_SKELETON_CELL_COUNT },
                (_, index) => (
                  <span key={index} className="learn-embed-skeleton-cell" />
                ),
              )}
            </div>
            <span
              className="learn-embed-loading-indicator"
              data-testid="learn-embed-loading-indicator"
              aria-hidden="true"
            />
          </>
        ) : null}
        <iframe
          ref={iframeRef}
          className={
            iframeLoaded
              ? "learn-embed-frame"
              : "learn-embed-frame learn-embed-frame--loading"
          }
          data-testid="learn-scrum-iframe"
          src={embedUrl}
          title={t(locale, "admin.guide.learn_scrum_iframe_title")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={frameHeightStyle}
          onLoad={() => {
            setIframeLoaded(true);
          }}
        />
      </div>
      <p className="learn-embed-fallback">
        <Link href={SDD_LEARN_SITE_URL} target="_blank" rel="noopener noreferrer">
          {t(locale, "admin.guide.learn_scrum_open_external")}
        </Link>
      </p>
      <GuideSecretLookup locale={locale} />
    </section>
  );
}
