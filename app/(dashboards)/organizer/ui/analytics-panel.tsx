"use client"

import { useEffect, useMemo, useState } from "react"
import { getAll, keys, type OrgEvent, type Participant, type Submission } from "../lib/local-db"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsPanel({ compact = false }: { compact?: boolean }) {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [subs, setSubs] = useState<Submission[]>([])

  function refresh() {
    setEvents(getAll<OrgEvent>(keys.events))
    setParticipants(getAll<Participant>(keys.participants))
    setSubs(getAll<Submission>(keys.submissions))
  }
  useEffect(refresh, [])

  const registrationsByDay = useMemo(() => {
    const map = new Map<string, number>()
    participants.forEach((p) => {
      const d = new Date(p.createdAt)
      const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      map.set(k, (map.get(k) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [participants])

  const roleDist = useMemo(() => {
    const c = { student: 0, professional: 0, mentor: 0 }
    participants.forEach((p) => {
      ;(c as any)[p.role]++
    })
    return [
      { name: "student", value: c.student },
      { name: "professional", value: c.professional },
      { name: "mentor", value: c.mentor },
    ]
  }, [participants])

  const subByEvent = useMemo(() => {
    const map = new Map<string, number>()
    subs.forEach((s) => {
      map.set(s.eventId, (map.get(s.eventId) || 0) + 1)
    })
    return Array.from(map.entries()).map(([id, count]) => ({
      event: events.find((e) => e.id === id)?.title || "Unknown",
      count,
    }))
  }, [subs, events])

  const colors = ["#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"]

  return (
    <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="font-semibold mb-2">Registrations by Day</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationsByDay}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="font-semibold mb-2">Role Distribution</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={roleDist} dataKey="value" nameKey="name" outerRadius={70}>
                {roleDist.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:col-span-1">
        <h4 className="font-semibold mb-2">Submissions per Event</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subByEvent}>
              <XAxis dataKey="event" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="count" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
