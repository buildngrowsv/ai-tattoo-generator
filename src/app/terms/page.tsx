import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tattoo.symplyai.io";

export const metadata: Metadata = {
  title: "Terms of Service | InkAI",
  description: "Terms of service for InkAI.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service | InkAI",
    description: "Terms of service for InkAI.",
    url: `${SITE_URL}/terms`,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <a href="/" className="text-sm text-violet-500 hover:text-violet-400">
          Back to InkAI
        </a>
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p>
          Use InkAI lawfully and only with content you have rights to use. Paid access depends on
          the current checkout and fulfillment flow described on the site.
        </p>
      </div>
    </main>
  );
}
