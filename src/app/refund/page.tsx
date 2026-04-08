import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tattoo.symplyai.io";

export const metadata: Metadata = {
  title: "Refund Policy | InkAI",
  description: "Refund policy for InkAI.",
  alternates: {
    canonical: `${SITE_URL}/refund`,
  },
  openGraph: {
    title: "Refund Policy | InkAI",
    description: "Refund policy for InkAI.",
    url: `${SITE_URL}/refund`,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <a href="/" className="text-sm text-violet-500 hover:text-violet-400">
          Back to InkAI
        </a>
        <h1 className="text-4xl font-bold">Refund Policy</h1>
        <p>
          If checkout succeeds but the paid service is not delivered as described, contact{" "}
          <a className="text-violet-500 hover:text-violet-400" href="mailto:support@inkai.app">
            support@inkai.app
          </a>{" "}
          within 14 days with your receipt.
        </p>
      </div>
    </main>
  );
}
