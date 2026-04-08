"use client";

/**
 * GA4 web event helpers for InkAI.
 *
 * These helpers are intentionally narrow:
 * - They only send low-cardinality product signals.
 * - They never send prompt text, generated artwork, or other user content.
 * - They assume the app shell loads GA4 via NEXT_PUBLIC_GA_MEASUREMENT_ID.
 *
 * If you are unsure whether an event should be added here, check the local
 * route/component that owns the user action and the Google Analytics docs.
 */

type TattooGenerationParams = {
  placement: string;
  size: string;
  style: string;
};

type GAEventParams = Record<string, string | number | boolean | null | undefined>;

function trackGAEvent(eventName: string, params: GAEventParams) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

export function ga4TrackViewPricing() {
  trackGAEvent("view_pricing", {
    surface: "pricing",
  });
}

export function ga4TrackBeginCheckout() {
  trackGAEvent("begin_checkout", {
    currency: "USD",
    surface: "pricing",
    plan_name: "pro",
  });
}

export function ga4TrackTattooGenerationRequested(params: TattooGenerationParams) {
  trackGAEvent("tattoo_generation_requested", {
    placement: params.placement,
    size: params.size,
    style: params.style,
    surface: "generator",
  });
}

export function ga4TrackTattooGenerationCompleted(params: TattooGenerationParams) {
  trackGAEvent("tattoo_generation_completed", {
    placement: params.placement,
    size: params.size,
    style: params.style,
    surface: "generator",
  });
}
