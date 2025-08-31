"use client"
import { useState } from "react"

export function ShortlistPanel() {
  const [job, setJob] = useState("")
  const [resumes, setResumes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  async function rank() {
    setError(null)
    setResult(null)
    const candidates = resumes
      .split("\n----")
      .map((s) => s.trim())
      .filter(Boolean)

    if (!job.trim() || candidates.length === 0) {
      setError(
        "Please add a job description and at least one resume (separate resumes with a line that starts with ----).",
      )
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/recruiter/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: job, candidates }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to rank")
      setResult(json?.data || json)
    } catch (e: any) {
      setError(e?.message || "Failed to rank")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-lg font-semibold">AI CV Shortlisting</h3>
      <p className="text-sm opacity-80">
        Paste a job description and one or more resumes. Separate resumes with a line that begins with "----".
      </p>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Job Description</label>
        <textarea
          className="min-h-28 rounded border bg-background p-2"
          placeholder="Role, responsibilities, required skills..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Resumes</label>
        <textarea
          className="min-h-40 rounded border bg-background p-2"
          placeholder={"Paste resume #1\n----\nPaste resume #2\n----\nPaste resume #3"}
          value={resumes}
          onChange={(e) => setResumes(e.target.value)}
        />
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      <button
        onClick={rank}
        disabled={loading}
        className="bg-primary text-primary-foreground px-3 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Ranking..." : "Rank Candidates"}
      </button>

      {result ? (
        <div className="mt-4 rounded border p-3">
          <h4 className="font-semibold mb-2">Results</h4>
          {"rankings" in result ? (
            <ul className="space-y-2">
              {result.rankings.map((r: any, idx: number) => (
                <li key={idx} className="text-sm">
                  <span className="font-mono">#{r.index}</span> <span className="font-semibold">Score:</span> {r.score}{" "}
                  — {r.reason}
                </li>
              ))}
            </ul>
          ) : (
            <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      ) : null}
    </div>
  )
}
