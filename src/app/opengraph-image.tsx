/**
 * Dynamically generated Open Graph image for ai-tattoo-generator.
 *
 * WHY THIS APPROACH: A static PNG in /public could get stale; this generates
 * on-demand (and is CDN-cached by Vercel). No external service needed — built
 * into Next.js 13+ via ImageResponse.
 *
 * ACCENT COLOR: #8b5cf6 (purple) matches TattooAI brand. Dark background for contrast.
 *
 * RESULT: Twitter/X, Discord, Slack, iMessage, LinkedIn will show a branded
 * preview card instead of a blank link.
 *
 * Called from: metadata.openGraph.images[0].url in [locale]/layout.tsx
 * Dimensions: 1200x630 (standard OG large-card format)
 */

import { ImageResponse } from "next/og";

/** Standard OG image dimensions — required by most platforms for large-card format. */
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "edge";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(139,92,246,0.15) 0%, transparent 55%), " +
            "radial-gradient(circle at 75% 75%, rgba(139,92,246,0.12) 0%, transparent 55%)",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Subtle grid lines for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Brand emoji */}
        <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>
          🎨
        </div>

        {/* Brand name with accent gradient */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 1.0,
            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #8b5cf6 100%)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          TattooAI
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            fontWeight: 400,
            letterSpacing: "-0.5px",
            lineHeight: 1.4,
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          AI Tattoo Design Generator
        </div>

        {/* Feature badges row */}
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Custom Designs", "Instant Preview", "Multiple Styles"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(139,92,246,0.10)",
                  border: "1px solid rgba(139,92,246,0.28)",
                  borderRadius: 9999,
                  padding: "8px 20px",
                  fontSize: 17,
                  color: "#8b5cf6",
                  fontWeight: 500,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "rgba(255,255,255,0.30)",
            letterSpacing: "0.5px",
          }}
        >
          tattoo.symplyai.io
        </div>
      </div>
    ),
    { ...size }
  );
}
