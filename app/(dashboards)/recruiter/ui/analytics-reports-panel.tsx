"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsReportsPanel() {
  // read localStorage directly to avoid importing the hook multiple times
  const isBrowser = typeof window !== "undefined"
  const parse = (k: string) => (isBrowser ? JSON.parse(window.localStorage.getItem(k) || "[]") : [])
  const talent = parse("recruiter.talent") as any[]
  const jobs = parse("recruiter.jobs") as any[]
  const shortlist = parse("recruiter.shortlist") as any[]
  const meetings = parse("recruiter.meetings") as any[]
  const events = parse("recruiter.events") as any[]

  const exportJson = () => {
    if (!isBrowser) return
    const payload = {
      talent,
      jobs,
      shortlist,
      meetings,
      events,
      branding: JSON.parse(window.localStorage.getItem("recruiter.branding") || "{}"),
      filters: JSON.parse(window.localStorage.getItem("recruiter.filters") || "{}"),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "recruiter-dashboard-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    if (!isBrowser) return
    const keys = [
      "recruiter.talent",
      "recruiter.jobs",
      "recruiter.shortlist",
      "recruiter.meetings",
      "recruiter.events",
      "recruiter.branding",
      "recruiter.filters",
      "recruiter_offers",
      "recruiter_interviews",
      "recruiter.judgesDemo",
    ]
    keys.forEach((k) => window.localStorage.removeItem(k))
    // force a soft refresh of counts
    window.location.reload()
  }

  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-lg border border-border/60 bg-background/20 p-4 text-center">
            <div className="text-xs text-foreground/80">TALENT</div>
            <div className="text-2xl font-semibold text-foreground">{talent.length}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/20 p-4 text-center">
            <div className="text-xs text-foreground/80">POSTINGS</div>
            <div className="text-2xl font-semibold text-foreground">{jobs.length}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/20 p-4 text-center">
            <div className="text-xs text-foreground/80">SHORTLIST</div>
            <div className="text-2xl font-semibold text-foreground">{shortlist.length}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/20 p-4 text-center">
            <div className="text-xs text-foreground/80">MEETINGS</div>
            <div className="text-2xl font-semibold text-foreground">{meetings.length}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/20 p-4 text-center">
            <div className="text-xs text-foreground/80">EVENTS</div>
            <div className="text-2xl font-semibold text-foreground">{events.length}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportJson}
            className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm text-white hover:bg-white/20"
          >
            EXPORT JSON
          </button>
          <button
            onClick={clearAll}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            CLEAR ALL
          </button>
        </div>
      </div>
    </div>
  )
}
