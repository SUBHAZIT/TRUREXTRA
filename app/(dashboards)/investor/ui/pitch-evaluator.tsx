"use client"

import { useState } from "react"

export default function PitchEvaluator() {
  const [pitch, setPitch] = useState("")
  const [criteria, setCriteria] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  async function evaluate() {
    setError(null)
    setResult(null)
    if (!pitch.trim()) {
      setError("Please paste a pitch first.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/investor/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, criteria }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to score pitch")
      setResult(json?.data || json)
    } catch (e: any) {
      setError(e?.message || "Failed to score pitch")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 uppercase">
      <h3 className="sr-only">AI Pitch Evaluator</h3>
      <p className="text-sm text-white/80">
        Paste a startup pitch and get a quick, structured evaluation with next steps.
      </p>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-white/90">Pitch</label>
        <textarea
          className="min-h-40 rounded-md border border-white/20 bg-white/5 p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Describe problem, solution, market, traction, team..."
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-white/90">Criteria (optional)</label>
        <input
          className="rounded-md border border-white/20 bg-white/5 p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Team, Market, Product, Traction, Moat, Financials, Risks"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
      </div>

      {error ? <p className="text-red-400 text-sm">{error}</p> : null}

      <button
        onClick={evaluate}
        disabled={loading}
        className="rounded-md px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
      >
        {loading ? "Scoring..." : "Score Pitch"}
      </button>

      {result ? (
        <div className="mt-4 rounded-md border border-white/20 bg-white/5 p-3 space-y-2">
          {"scores" in result ? (
            <>
              <h4 className="font-semibold text-white">Scores</h4>
              <ul className="grid grid-cols-2 gap-1 text-sm text-white/90">
                {Object.entries(result.scores || {}).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium">{k}:</span> {String(v)}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/90">
                <span className="font-semibold">Overall:</span> {result.overall}
              </p>
              <p className="text-sm text-white/90">
                <span className="font-semibold">Summary:</span> {result.summary}
              </p>
              <div>
                <h5 className="font-semibold text-white">Next Steps</h5>
                <ul className="list-disc pl-5 text-sm text-white/90">
                  {(result.nextSteps || []).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <pre className="text-xs overflow-auto text-white/90">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      ) : null}
    </div>
  )
}
