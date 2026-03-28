export const metadata = {
  title: "Terms of Service | InkAI",
  description: "Terms of service for InkAI.",
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
