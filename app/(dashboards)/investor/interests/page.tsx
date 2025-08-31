"use client"
import { useEffect, useState } from "react"

export default function InvestorInterestsPage() {
  const [topic, setTopic] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    try {
      const res = await fetch("/api/investor/interests")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      setList(json.data || [])
    } catch (e: any) {
      setError(e?.message || "Failed")
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function add() {
    setError(null)
    if (!topic.trim()) {
      setError("TOPIC IS REQUIRED")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/investor/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, note: note || null }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      setTopic("")
      setNote("")
      load()
    } catch (e: any) {
      setError(e?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">Investor Interests</h1>
      <div className="rounded-lg border border-white/10 p-4 bg-white/5">
        <h3 className="font-bold mb-3 uppercase">Add Interest</h3>
        <div className="grid gap-3">
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
            placeholder="TOPIC (e.g., AI, Fintech)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
            placeholder="NOTE (OPTIONAL)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {error ? (
            <p className="text-yellow-300 text-sm">
              {error.includes("relation") ? "Please run scripts/006_investor.sql" : error}
            </p>
          ) : null}
          <button
            onClick={add}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded-lg font-medium uppercase disabled:opacity-60"
          >
            {loading ? "ADDING..." : "ADD INTEREST"}
          </button>
        </div>
      </div>
      <section>
        <h2 className="font-semibold mb-2 uppercase">My Interests</h2>
        <ul className="space-y-2">
          {list.map((i: any) => (
            <li key={i.id} className="border border-white/10 rounded-lg p-3 bg-white/5">
              <div className="font-semibold">{i.topic}</div>
              {i.note ? <div className="text-sm opacity-80">{i.note}</div> : null}
            </li>
          ))}
          {!list.length ? <li className="opacity-70">No interests yet.</li> : null}
        </ul>
      </section>
    </main>
  )
}
