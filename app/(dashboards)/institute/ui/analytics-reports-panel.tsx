"use client"

import { Button } from "@/components/ui/button"

export default function AnalyticsReportsPanel() {
  // safe reads (avoid SSR issues)
  const read = (key: string) => {
    if (typeof window === "undefined") return []
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  const students = read("inst_students")
  const events = read("inst_events")
  const topics = read("inst_topics")
  const mentors = read("inst_mentors")
  const alumni = read("inst_alumni")
  const resources = read("inst_resources")

  const counts = {
    STUDENTS: students.length,
    EVENTS: events.length,
    TOPICS: topics.length,
    MENTORS: mentors.length,
    ALUMNI: alumni.length,
    RESOURCES: resources.length,
  }

  function exportReport() {
    const blob = new Blob(
      [
        JSON.stringify(
          { generatedAt: new Date().toISOString(), counts, students, events, topics, mentors, alumni, resources },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "institute-analytics.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">PERFORMANCE INSIGHTS, EVENT OUTCOMES, AND STUDENT PROGRESS.</p>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(counts).map(([k, v]) => (
            <li key={k} className="rounded-md border border-border/50 bg-background/10 p-3 text-center">
              <div className="text-xs text-foreground/70">{k}</div>
              <div className="text-2xl font-extrabold">{v}</div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground">VIEW ANALYTICS</Button>
          <Button variant="outline" className="border-border/60 bg-background/20" onClick={exportReport}>
            EXPORT REPORT
          </Button>
        </div>
      </div>
    </div>
  )
}
