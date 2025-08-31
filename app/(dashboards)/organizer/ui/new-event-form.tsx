"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewEventForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [venue, setVenue] = useState("")
  const [startAt, setStartAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function createEvent() {
    setError(null)
    setOk(null)
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, venue, start_at: startAt || null }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Failed to create event")
      }
      setOk("Event created")
      setTitle("")
      setDescription("")
      setVenue("")
      setStartAt("")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="mb-2 text-lg font-semibold">CREATE EVENT</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hackathon 2025"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event details"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Venue</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Auditorium / Online"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Start at</label>
            <input
              type="datetime-local"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {ok ? <p className="text-sm text-green-500">{ok}</p> : null}
        <div>
          <button
            onClick={createEvent}
            disabled={loading}
            className="rounded bg-primary text-primary-foreground px-4 py-2 uppercase disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create event"}
          </button>
        </div>
      </div>
    </div>
  )
}
