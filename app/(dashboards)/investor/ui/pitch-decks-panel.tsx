"use client"

import useSWR from "swr"
import { useCallback, useMemo, useState } from "react"
import { Download, Plus, Trash2 } from "lucide-react"

type PitchDeck = {
  id: string
  title: string
  url: string
  createdAt: string
}

const LS_KEY = "investor:pitch-decks"

function lsRead(): PitchDeck[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function lsWrite(items: PitchDeck[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

async function fetchDecks(): Promise<PitchDeck[]> {
  const headers = new Headers()
  headers.set("x-localstorage-pitch-decks", JSON.stringify(lsRead()))
  const res = await fetch("/api/investor/pitch-decks", { headers, cache: "no-store" })
  const json = await res.json()
  return json.items || []
}

export default function PitchDecksPanel() {
  const { data, mutate, isValidating } = useSWR<PitchDeck[]>("pitch-decks", fetchDecks, {
    fallbackData: lsRead(),
    revalidateOnFocus: false,
  })

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const items = data ?? []

  const handleAdd = useCallback(async () => {
    setError(null)
    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.")
      return
    }
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("x-localstorage-pitch-decks", JSON.stringify(lsRead()))
    const res = await fetch("/api/investor/pitch-decks", {
      method: "POST",
      headers,
      body: JSON.stringify({ title: title.trim(), url: url.trim() }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json?.error || "Failed to add")
      return
    }
    lsWrite(json.items || [])
    setTitle("")
    setUrl("")
    mutate(json.items, false)
  }, [title, url, mutate])

  const handleDelete = useCallback(
    async (id: string) => {
      const headers = new Headers()
      headers.set("Content-Type", "application/json")
      headers.set("x-localstorage-pitch-decks", JSON.stringify(lsRead()))
      const res = await fetch("/api/investor/pitch-decks", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) return
      lsWrite(json.items || [])
      mutate(json.items, false)
    },
    [mutate],
  )

  const empty = useMemo(() => (items || []).length === 0, [items])

  return (
    <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white text-xl font-bold">Pitch Deck Access</div>
          <p className="text-sm text-gray-300">Browse and manage submitted pitch decks.</p>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <input
          className="rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 px-3 py-2"
          placeholder="Deck title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 px-3 py-2"
          placeholder="Public URL (PDF/Slides)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus size={16} /> Add Deck
        </button>
      </div>

      {error ? <p className="text-yellow-300 text-xs mt-2">{error}</p> : null}

      <div className="mt-5">
        {empty ? (
          <p className="text-sm text-gray-300">No pitch decks yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{d.title}</div>
                  <a
                    className="text-xs text-cyan-200 hover:text-cyan-100 truncate block"
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {d.url}
                  </a>
                  <div className="text-[11px] text-white/60 mt-1">{new Date(d.createdAt).toLocaleString()}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-xs"
                  >
                    <Download size={14} /> Open
                  </a>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white px-2 py-1 text-xs"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isValidating ? <p className="text-[11px] text-white/60 mt-2">Refreshing…</p> : null}
    </div>
  )
}
