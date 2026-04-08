export const metadata = {
  title: "Privacy Policy | InkAI",
  description: "Privacy policy for InkAI.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <a href="/" className="text-sm text-violet-500 hover:text-violet-400">
            Back to InkAI
          </a>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: 2026-04-07</p>
        </div>
        <p className="text-muted-foreground">
          InkAI processes prompts, style selections, uploaded reference images,
          and request metadata to generate tattoo designs, operate checkout, and
          support paying customers.
        </p>
        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Data we process</h2>
          <p>
            Text prompts, style preferences, optional reference images, billing
            metadata, and technical logs needed for security and reliability.
          </p>
          <p>
            Your data may be shared with the following third-party processors as
            part of delivering the service:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>fal.ai</strong> — AI image generation. Prompts and optional
              reference images are sent to fal.ai servers for tattoo design
              rendering.
            </li>
            <li>
              <strong>Stripe</strong> — Payment processing. Billing details
              (card info, email, purchase history) are handled by Stripe. InkAI
              does not store raw card numbers.
            </li>
            <li>
              <strong>Google Analytics 4</strong> — Anonymous usage analytics and
              traffic measurement. Collects page views, session data, and
              anonymised device information.
            </li>
            <li>
              <strong>Vercel</strong> — Application hosting and edge network.
              Requests pass through Vercel infrastructure which may log IP
              addresses and request metadata for reliability.
            </li>
            <li>
              <strong>Cloudflare</strong> — CDN, DNS resolution, and DDoS
              protection. Cloudflare processes request headers and IP addresses
              to route and protect traffic.
            </li>
          </ul>
        </section>
        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">How we use it</h2>
          <p>
            We use this data to generate tattoo designs, enforce usage limits,
            activate paid access, investigate abuse, and handle support or refund
            requests.
          </p>
          <p>
            We aim to minimise retention, but some logs and billing records may
            be kept for security, fraud prevention, or legal compliance.
          </p>
        </section>
        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time. We will respond within 30 days.
          </p>
        </section>
        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
          <p>
            Email privacy requests to{" "}
            <a
              className="text-violet-500 hover:text-violet-400"
              href="mailto:support@symplyai.io"
            >
              support@symplyai.io
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}
