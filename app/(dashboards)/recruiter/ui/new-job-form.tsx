"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewJobForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function createJob() {
    setError(null)
    setOk(null)
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, location, job_type: jobType }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Failed to create job")
      }
      setOk("Job created")
      setTitle("")
      setDescription("")
      setLocation("")
      setJobType("")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="mb-2 text-lg font-semibold">POST A JOB</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief role description"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Remote / City"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              placeholder="Full-time / Contract"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {ok ? <p className="text-sm text-green-500">{ok}</p> : null}
        <div>
          <button
            onClick={createJob}
            disabled={loading}
            className="rounded bg-primary text-primary-foreground px-4 py-2 uppercase disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post job"}
          </button>
        </div>
      </div>
    </div>
  )
}
