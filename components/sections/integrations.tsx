const INTEGRATIONS = [
  { name: "LeetCode", desc: "Practice coding challenges directly within TRUREXTRA." },
  { name: "Unstop", desc: "Participate in competitions and hackathons." },
  { name: "LinkedIn", desc: "Build your profile and network seamlessly." },
  { name: "Agentic AI", desc: "Personalized learning and career recommendations." },
  { name: "AI Chatbot", desc: "24/7 instant assistance." },
]

export function Integrations() {
  return (
    <section id="integrations" className="border-t bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Key integrations</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Connect your learning, practice, and network with built‑in integrations.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {INTEGRATIONS.map((it) => (
            <div key={it.name} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{it.name}</h3>
                <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">Built‑in</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
