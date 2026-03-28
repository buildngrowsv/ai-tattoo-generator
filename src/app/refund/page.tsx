export const metadata = {
  title: "Refund Policy | InkAI",
  description: "Refund policy for InkAI.",
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
