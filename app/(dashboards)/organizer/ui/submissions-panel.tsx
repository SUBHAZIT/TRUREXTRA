"use client"

import { useEffect, useMemo, useState } from "react"
import { addOne, getAll, keys, uid, updateOne, type OrgEvent, type Submission } from "../lib/local-db"

export function SubmissionsPanel() {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [rows, setRows] = useState<Submission[]>([])
  const [filterEvent, setFilterEvent] = useState<string>("all")

  function refresh() {
    setEvents(getAll<OrgEvent>(keys.events))
    setRows(getAll<Submission>(keys.submissions))
  }
  useEffect(refresh, [])

  const filtered = useMemo(
    () => rows.filter((s) => filterEvent === "all" || s.eventId === filterEvent),
    [rows, filterEvent],
  )

  function addSubmission() {
    const team = (document.getElementById("steams") as HTMLInputElement).value
    const eventId = (document.getElementById("sevent") as HTMLSelectElement).value
    const repo = (document.getElementById("srepo") as HTMLInputElement).value
    if (!team || !eventId) return alert("Team and Event required")
    addOne<Submission>(keys.submissions, { id: uid("sub"), eventId, team, repo, createdAt: Date.now() })
    refresh()
  }

  function score(id: string) {
    const s = rows.find((r) => r.id === id)
    if (!s) return
    const val = prompt("Enter score (0-100)", s.score?.toString() || "0")
    if (val == null) return
    const note = prompt("Judge note", s.judgeNote || "") || s.judgeNote
    updateOne<Submission>(keys.submissions, { ...s, score: Number(val), judgeNote: note })
    refresh()
  }

  const leaderboard = [...filtered].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-2">
        <input
          id="steams"
          placeholder="Team name"
          className="rounded-md border border-border bg-background px-3 py-2"
        />
        <select id="sevent" className="rounded-md border border-border bg-background px-3 py-2">
          <option value="">select event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <input
          id="srepo"
          placeholder="GitHub repo (optional)"
          className="rounded-md border border-border bg-background px-3 py-2"
        />
        <button
          onClick={addSubmission}
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
        >
          Add Submission
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-border bg-background px-3 py-2"
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
        >
          <option value="all">event: all</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Team</th>
              <th className="py-2 pr-4">Event</th>
              <th className="py-2 pr-4">Repo</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="py-2 pr-4">{s.team}</td>
                <td className="py-2 pr-4">{events.find((e) => e.id === s.eventId)?.title}</td>
                <td className="py-2 pr-4">{s.repo || "-"}</td>
                <td className="py-2 pr-4">{s.score ?? "-"}</td>
                <td className="py-2 pr-0 text-right">
                  <button
                    className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                    onClick={() => score(s.id)}
                  >
                    Score
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No submissions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Leaderboard */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Leaderboard</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Team</th>
                <th className="py-2 pr-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((s, i) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4">{s.team}</td>
                  <td className="py-2 pr-4">{s.score ?? "-"}</td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground">
                    No ranked data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
