"use client"

import React from "react"
import AddInterestButton from "./startup-directory_add-interest"

type Startup = {
  id: string
  name: string
  description?: string
  stage?: string
  created_at: string
}

const STORAGE_KEY = "investor.startupDirectory"

function loadStartups(): Startup[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Startup[]) : []
  } catch {
    return []
  }
}

function saveStartups(items: Startup[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export default function StartupDirectory() {
  const [startups, setStartups] = React.useState<Startup[]>([])
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [stage, setStage] = React.useState("")

  React.useEffect(() => {
    setStartups(loadStartups())
  }, [])

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const item: Startup = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim() || undefined,
      stage: stage.trim() || undefined,
      created_at: new Date().toISOString(),
    }
    const next = [item, ...startups]
    setStartups(next)
    saveStartups(next)
    setName("")
    setDescription("")
    setStage("")
  }

  const onRemove = (id: string) => {
    const next = startups.filter((s) => s.id !== id)
    setStartups(next)
    saveStartups(next)
  }

  return (
    <div className="space-y-4 uppercase">
      {/* Header inside parent glass card */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-white text-xl font-bold">Startup Directory</h3>
          <p className="text-sm text-gray-300">Browse or add startups locally. Data is saved in your browser.</p>
        </div>
      </div>

      {/* Add form - transparent/glass inline panel */}
      <form
        onSubmit={onAdd}
        className="rounded-xl border border-white/20 bg-black/20 backdrop-blur-md p-4 shadow-lg flex flex-col gap-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            aria-label="Startup name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-md border border-white/20 bg-black/20 backdrop-blur-md text-white placeholder:text-white/60 px-3 py-2"
          />
          <input
            aria-label="Startup description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded-md border border-white/20 bg-black/20 backdrop-blur-md text-white placeholder:text-white/60 px-3 py-2"
          />
          <input
            aria-label="Startup stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="Stage (idea, MVP, seed...)"
            className="rounded-md border border-white/20 bg-black/20 backdrop-blur-md text-white placeholder:text-white/60 px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-md px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
          >
            Add Startup
          </button>
          <button
            type="button"
            onClick={() => {
              setStartups([])
              saveStartups([])
            }}
            className="rounded-md px-3 py-2 bg-white/10 text-white hover:bg-white/20"
          >
            Clear All
          </button>
        </div>
      </form>

      {/* List */}
      {startups.length === 0 ? (
        <p className="text-sm text-gray-300">No startups found. Add your first startup above.</p>
      ) : (
        <ul className="space-y-3">
          {startups.map((s) => (
            <li key={s.id} className="rounded-xl border border-white/15 bg-black/10 backdrop-blur-md shadow-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{s.name.toUpperCase()}</div>
                  <div className="text-sm text-gray-300">{s.description || "—"}</div>
                  <div className="text-xs text-gray-400 mt-1">Stage: {s.stage || "N/A"}</div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Keep the existing interest flow if available */}
                  <AddInterestButton startupId={s.id} startupName={s.name} />
                  <button
                    onClick={() => onRemove(s.id)}
                    className="rounded-md px-3 py-2 bg-white/10 text-white hover:bg-white/20"
                    aria-label={`Remove ${s.name}`}
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
