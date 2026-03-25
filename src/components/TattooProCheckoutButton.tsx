"use client";

/**
 * TattooProCheckoutButton — client component that POSTs to
 * /api/stripe/create-checkout and redirects the user to Stripe Checkout.
 *
 * WHY separate client component: the pricing page is a server component for
 * getTranslations() performance; only the interactive button needs client JS.
 * This is the standard Next.js App Router pattern for partially-interactive pages.
 *
 * WHY this instead of the existing buy.stripe.com payment link on PricingSectionWithTiers:
 * The API route approach gives us webhook support, metadata per session, and
 * dynamic success/cancel URLs that work across Vercel preview and production
 * deployments. The payment link still works as a fallback for users who click
 * the static CTA, but this button is the proper server-side checkout path.
 *
 * Reference: PricingCheckoutButton in ai-chart-generator (commit 48daace, T35).
 */

import { useState } from "react";
import { Crown } from "lucide-react";

interface TattooProCheckoutButtonProps {
  /** Text to display on the button */
  label: string;
}

export function TattooProCheckoutButton({ label }: TattooProCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error || "Failed to start checkout.");
      }
      // Redirect to Stripe-hosted checkout page
      window.location.href = json.url;
    } catch (e) {
      // Payment Link fallback: AI Tattoo Generator Pro ($9.99/mo) — no env vars needed.
      // When STRIPE_SECRET_KEY or STRIPE_PRICE_ID_PRO is not configured on Vercel,
      // the create-checkout route returns an error. Rather than showing a confusing
      // error to the user, fall back to the pre-built Stripe Payment Link which
      // handles the full checkout without a server-side checkout session.
      // Source: Github/ai-clone-stripe-links.md — Builder 6 pane1774 2026-03-25.
      console.error("Stripe checkout API failed, falling back to Payment Link:", e);
      window.location.href = "https://buy.stripe.com/eVq14ngEhbUYgDN1CVfMA05";
      // Don't reset loading — keep button disabled during Payment Link navigation
    }
    // Don't reset loading after redirect — keeps button disabled during navigation
  }

  return (
    <div className="flex flex-col gap-2 mt-auto w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Crown className="w-4 h-4" />
        {loading ? "Redirecting to checkout…" : label}
      </button>
      {error ? (
        <p className="text-xs text-red-400 text-center">{error}</p>
      ) : null}
    </div>
  );
}
