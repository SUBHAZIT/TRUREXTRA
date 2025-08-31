export const metadata = { title: "PRICING — TRUREXTRA" }

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">PRICING</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          CLEAR, TRANSPARENT PLANS FOR INDIVIDUALS, TEAMS, AND INSTITUTIONS.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">FREE</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>CORE FEATURES</li>
            <li>LIMITED EVENTS</li>
            <li>COMMUNITY ACCESS</li>
          </ul>
          <div className="mt-6 text-2xl font-semibold">$0</div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">PRO</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>ALL CORE FEATURES</li>
            <li>ADVANCED ANALYTICS</li>
            <li>AI MENTOR PRIORITY</li>
          </ul>
          <div className="mt-6 text-2xl font-semibold">$19/MO</div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">INSTITUTION</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>UNLIMITED SEATS</li>
            <li>EVENT MANAGEMENT</li>
            <li>DEDICATED SUPPORT</li>
          </ul>
          <div className="mt-6 text-2xl font-semibold">CONTACT</div>
        </div>
      </section>
    </main>
  )
}
