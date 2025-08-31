"use client"

import { useEffect, useMemo, useState } from "react"

type DealItem = {
  id: string
  teamName: string
  project: string
  score?: number
  notes?: string
  top?: boolean
  createdAt: number
}

const STORAGE_KEY = "investor:dealflow"

export default function DealFlowPanel() {
  const [items, setItems] = useState<DealItem[]>([])
  const [teamName, setTeamName] = useState("")
  const [project, setProject] = useState("")
  const [score, setScore] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [filter, setFilter] = useState<"all" | "top">("all")

  // Load and persist to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  function addItem() {
    if (!teamName.trim() || !project.trim()) return
    const newItem: DealItem = {
      id: Math.random().toString(36).slice(2),
      teamName: teamName.trim(),
      project: project.trim(),
      score: score ? Number(score) : undefined,
      notes: notes || undefined,
      top: false,
      createdAt: Date.now(),
    }
    setItems((prev) => [newItem, ...prev])
    setTeamName("")
    setProject("")
    setScore("")
    setNotes("")
  }

  function toggleTop(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, top: !it.top } : it)))
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const shown = useMemo(() => {
    const list = [...items].sort((a, b) => {
      const sa = typeof a.score === "number" ? a.score : -1
      const sb = typeof b.score === "number" ? b.score : -1
      return sb - sa
    })
    return filter === "top" ? list.filter((i) => i.top) : list
  }, [items, filter])

  return (
    <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-white text-xl font-bold">Hackathon Deal Flow</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              filter === "all" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("top")}
            className={`px-3 py-1 rounded-md text-sm font-semibold ${
              filter === "top" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Top Picks
          </button>
        </div>
      </div>

      {/* Add form */}
      <div className="grid gap-3 mb-5">
        <div className="grid gap-2">
          <label className="text-xs text-gray-300">Team Name</label>
          <input
            className="rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 placeholder:text-gray-300/70"
            placeholder="E.g., Quantum Coders"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs text-gray-300">Project</label>
          <input
            className="rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 placeholder:text-gray-300/70"
            placeholder="E.g., AI-based bug fixer"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs text-gray-300">Score (0–100, optional)</label>
          <input
            type="number"
            min={0}
            max={100}
            className="rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 placeholder:text-gray-300/70"
            placeholder="75"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs text-gray-300">Notes (optional)</label>
          <textarea
            className="rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 placeholder:text-gray-300/70 min-h-20"
            placeholder="What stood out about this team or project?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={addItem}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 font-semibold hover:from-blue-700 hover:to-indigo-700"
          >
            Save to Deal Flow
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {!shown.length ? (
          <p className="text-sm text-gray-300">No entries yet. Add teams you liked from recent hackathons.</p>
        ) : (
          shown.map((it) => (
            <div key={it.id} className="rounded-lg border border-white/20 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold">
                    {it.teamName}
                    {typeof it.score === "number" ? (
                      <span className="ml-2 text-xs text-gray-300">Score: {it.score}</span>
                    ) : null}
                    {it.top ? (
                      <span className="ml-2 text-xs rounded-full border border-white/20 px-2 py-0.5">Top</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-gray-300/90">{it.project}</div>
                  {it.notes ? <div className="text-xs text-gray-300/80 mt-1">{it.notes}</div> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTop(it.id)}
                    className={`text-xs rounded-md px-2 py-1 ${
                      it.top ? "bg-purple-600 text-white" : "bg-white/10 text-gray-200 hover:bg-white/20"
                    }`}
                  >
                    {it.top ? "Unmark Top" : "Mark Top"}
                  </button>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-xs rounded-md px-2 py-1 bg-white/10 text-gray-200 hover:bg-white/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
