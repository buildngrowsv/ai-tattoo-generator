export const metadata = {
  title: "Privacy Policy | InkAI",
  description: "Privacy policy for InkAI.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <a href="/" className="text-sm text-violet-500 hover:text-violet-400">
          Back to InkAI
        </a>
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p>
          InkAI processes prompts, style selections, and request metadata to generate tattoo
          designs, operate checkout, and support customers. Payments are handled by Stripe.
        </p>
        <p>
          Questions: <a className="text-violet-500 hover:text-violet-400" href="mailto:support@inkai.app">support@inkai.app</a>
        </p>
      </div>
    </main>
  );
}
