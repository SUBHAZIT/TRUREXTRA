"use client"

import { useState } from "react"

export default function AddInterestButton({ startupId, startupName }: { startupId: string; startupName: string }) {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function addInterest() {
    setLoading(true)
    setErr(null)
    setOk(false)
    try {
      // Reuse investor_interests table: topic describes interest; note stores startupId
      const res = await fetch("/api/investor/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: `portfolio:${startupName}`, note: startupId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed")
      setOk(true)
    } catch (e: any) {
      setErr(e?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={addInterest}
        disabled={loading}
        className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add Interest"}
      </button>
      {ok ? <p className="text-xs text-green-600 mt-1">Saved</p> : null}
      {err ? <p className="text-xs text-red-600 mt-1">{err}</p> : null}
    </div>
  )
}
