const DASHBOARDS = [
  { name: "Student", points: ["Access LeetCode, Unstop, LinkedIn", "Floating AI Helpbot", "MCQ skill checks"] },
  { name: "Mentor", points: ["LinkedIn-like community tools", "Schedule & host meetings", "Student engagement"] },
  { name: "Recruiter", points: ["Job posting & AI screening", "CV shortlisting", "Interview scheduling"] },
  { name: "Organizer", points: ["Online & offline events", "Find mentors & judges", "QR check-in management"] },
  { name: "Investor", points: ["Connect with startups", "Work with organizers & students"] },
  { name: "Academic/College", points: ["Campus-wide events", "QR participation", "Community building"] },
]

export function Dashboards() {
  return (
    <section id="dashboards" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Dashboards for every workflow</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Each role gets focused tools and insights—no clutter.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DASHBOARDS.map((d) => (
            <div key={d.name} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{d.name} Dashboard</h3>
                <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">Preview</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {d.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
