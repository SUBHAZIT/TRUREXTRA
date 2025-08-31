"use client"
import { useState } from "react"

export default function AddStudentForm({ programId, onAdded }: { programId?: string; onAdded?: () => void }) {
  const [studentId, setStudentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (!studentId.trim()) {
      setError("STUDENT ID IS REQUIRED")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/college/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId.trim(), program_id: programId || null }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      setStudentId("")
      onAdded?.()
    } catch (e: any) {
      setError(e?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-white/10 p-4 bg-white/5">
      <h3 className="font-bold mb-3 uppercase">Add Student</h3>
      <div className="grid gap-3">
        <input
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          placeholder="STUDENT USER ID (UUID)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        {error ? <p className="text-red-300 text-sm">{error}</p> : null}
        <button
          onClick={submit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded-lg font-medium uppercase disabled:opacity-60"
        >
          {loading ? "ADDING..." : "ADD STUDENT"}
        </button>
      </div>
    </div>
  )
}
