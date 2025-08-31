"use client"

import { useState } from "react"

export default function NewSessionForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [scheduledAt, setScheduledAt] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (!title.trim()) {
      setError("TITLE IS REQUIRED")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/mentor/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          scheduled_at: scheduledAt || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create session")
      setTitle("")
      setDescription("")
      setScheduledAt("")
      onCreated?.()
    } catch (e: any) {
      setError((e?.message || "Failed").toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-white/10 p-4 bg-white/5">
      <h3 className="font-bold mb-3 uppercase">Create New Session</h3>
      <div className="grid gap-3">
        <input
          placeholder="TITLE"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="DESCRIPTION (OPTIONAL)"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        {error ? <p className="text-red-300 text-sm">{error}</p> : null}
        <button
          onClick={submit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded-lg font-medium uppercase disabled:opacity-60"
        >
          {loading ? "CREATING..." : "CREATE SESSION"}
        </button>
      </div>
    </div>
  )
}
