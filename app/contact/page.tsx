export const metadata = { title: "CONTACT — TRUREXTRA" }

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">CONTACT</h1>
      <form className="mt-6 grid gap-4">
        <input className="w-full rounded-md border bg-background p-3" placeholder="YOUR NAME" aria-label="NAME" />
        <input className="w-full rounded-md border bg-background p-3" placeholder="YOUR EMAIL" aria-label="EMAIL" />
        <textarea
          className="min-h-32 w-full rounded-md border bg-background p-3"
          placeholder="YOUR MESSAGE"
          aria-label="MESSAGE"
        />
        <button className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground">
          SEND MESSAGE
        </button>
      </form>
    </main>
  )
}
