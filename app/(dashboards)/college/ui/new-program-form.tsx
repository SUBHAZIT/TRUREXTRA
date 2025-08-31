"use client"
import { useState } from "react"

export default function NewProgramForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (!name.trim()) {
      setError("NAME IS REQUIRED")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/college/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || null }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      setName("")
      setDescription("")
      onCreated?.()
    } catch (e: any) {
      setError(e?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-white/10 p-4 bg-white/5">
      <h3 className="font-bold mb-3 uppercase">Add Program</h3>
      <div className="grid gap-3">
        <input
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          placeholder="NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          placeholder="DESCRIPTION (OPTIONAL)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error ? <p className="text-red-300 text-sm">{error}</p> : null}
        <button
          onClick={submit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded-lg font-medium uppercase disabled:opacity-60"
        >
          {loading ? "ADDING..." : "ADD PROGRAM"}
        </button>
      </div>
    </div>
  )
}
