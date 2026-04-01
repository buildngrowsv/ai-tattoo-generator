/**
 * GA4 analytics loader for Next.js App Router templates.
 *
 * HOW IT WORKS:
 * - Load the gtag.js script only after the page is interactive.
 * - Initialize GA4 using NEXT_PUBLIC_GA_MEASUREMENT_ID.
 * - Send page_view hits whenever the pathname changes.
 *
 * WHY THIS PATTERN:
 * The template can be cloned and deployed across many projects while keeping
 * analytics integration standardized and centrally controlled through env vars.
 */
"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

type GoogleAnalyticsProps = {
  trackingId: string;
};

function sendPageView(trackingId: string, pathname: string) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("config", trackingId, {
      page_path: pathname || "/",
    });
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics({ trackingId }: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    sendPageView(trackingId, pathname);
  }, [trackingId, pathname]);

  if (!trackingId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script id="google-ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "${trackingId}");
        `}
      </Script>
    </>
  );
}

export default function GoogleAnalyticsLoader() {
  const trackingId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

  if (!trackingId) {
    return null;
  }

  return <GoogleAnalytics trackingId={trackingId} />;
}
