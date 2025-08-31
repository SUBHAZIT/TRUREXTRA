import Link from "next/link"

export const metadata = { title: "FEATURES — TRUREXTRA" }

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">FEATURES</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          EVERYTHING YOU NEED TO CONNECT, LEARN, AND GROW PROFESSIONALLY.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">AI MENTOR</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            PERSONALIZED GUIDANCE POWERED BY ADVANCED AI TO ACCELERATE YOUR LEARNING JOURNEY.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">PROFESSIONAL NETWORK</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            CONNECT WITH INDUSTRY EXPERTS, PEERS, AND COLLABORATORS WORLDWIDE.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">SKILL TRACKING</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            VISUALIZE PROGRESS AND FIND FOCUS AREAS WITH DETAILED ANALYTICS.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">EVENT MANAGEMENT</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            HOST AND PARTICIPATE IN HACKATHONS, WORKSHOPS, AND NETWORKING EVENTS.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">JOB MATCHING</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            DISCOVER OPPORTUNITIES TAILORED TO YOUR SKILLS AND GOALS.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">INNOVATION HUB</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            RESOURCES, FUNDING, AND MENTORSHIP FOR YOUR STARTUP IDEAS.
          </p>
        </article>
      </section>

      <footer className="mt-12 text-sm">
        <Link className="text-primary underline-offset-4 hover:underline" href="/pricing">
          VIEW PRICING
        </Link>
      </footer>
    </main>
  )
}
