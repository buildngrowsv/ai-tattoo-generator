"use client";

/**
 * Global error boundary — catches unhandled errors in any route segment.
 *
 * Shows a branded error message instead of a broken page in production.
 * The reset function re-renders the failed segment to clear transient errors.
 * Must be a client component (React error boundary requirement).
 */

import { useEffect } from "react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}>
      <h1 className="mb-2 text-5xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md" style={{ color: "#a1a1aa" }}>
        An unexpected error occurred. You can try again or head back to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          style={{ backgroundColor: "#7c3aed", color: "#fff" }}
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
          style={{ borderColor: "#27272a", color: "#fafafa" }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
