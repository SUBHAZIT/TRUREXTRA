export const metadata = { title: "INTEGRATIONS — TRUREXTRA" }

export default function IntegrationsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">INTEGRATIONS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          CONNECT YOUR FAVORITE TOOLS LIKE LEETCODE, UNSTOP, LINKEDIN, GITHUB, AND MORE.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">LEETCODE</h2>
          <p className="mt-2 text-sm text-muted-foreground">SYNC PROBLEMS SOLVED AND TRACK PRACTICE.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">UNSTOP</h2>
          <p className="mt-2 text-sm text-muted-foreground">DISCOVER AND TRACK COMPETITIONS AND HACKATHONS.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">LINKEDIN</h2>
          <p className="mt-2 text-sm text-muted-foreground">IMPORT EXPERIENCE AND GROW YOUR NETWORK.</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">GITHUB</h2>
          <p className="mt-2 text-sm text-muted-foreground">SHOWCASE PROJECTS AND COLLABORATIONS.</p>
        </div>
      </section>
    </main>
  )
}
