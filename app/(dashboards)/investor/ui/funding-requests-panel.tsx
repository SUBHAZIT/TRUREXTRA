"use client"

import useSWR from "swr"
import { useCallback, useMemo, useState } from "react"
import { Check, Plus, Trash2, X } from "lucide-react"

type FundingRequest = {
  id: string
  startup: string
  amount: number
  notes?: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

const LS_KEY = "investor:funding-requests"

function lsRead(): FundingRequest[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function lsWrite(items: FundingRequest[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

async function fetchRequests(): Promise<FundingRequest[]> {
  const headers = new Headers()
  headers.set("x-localstorage-funding-requests", JSON.stringify(lsRead()))
  const res = await fetch("/api/investor/funding-requests", { headers, cache: "no-store" })
  const json = await res.json()
  return json.items || []
}

export default function FundingRequestsPanel() {
  const { data, mutate, isValidating } = useSWR<FundingRequest[]>("funding-requests", fetchRequests, {
    fallbackData: lsRead(),
    revalidateOnFocus: false,
  })

  const [startup, setStartup] = useState("")
  const [amount, setAmount] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const items = data ?? []

  const handleAdd = useCallback(async () => {
    setError(null)
    const amt = Number(amount)
    if (!startup.trim() || !Number.isFinite(amt) || amt <= 0) {
      setError("Startup and a valid amount are required.")
      return
    }
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("x-localstorage-funding-requests", JSON.stringify(lsRead()))
    const res = await fetch("/api/investor/funding-requests", {
      method: "POST",
      headers,
      body: JSON.stringify({ startup: startup.trim(), amount: amt, notes: notes.trim() }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json?.error || "Failed to add")
      return
    }
    lsWrite(json.items || [])
    setStartup("")
    setAmount("")
    setNotes("")
    mutate(json.items, false)
  }, [startup, amount, notes, mutate])

  const handleDelete = useCallback(
    async (id: string) => {
      const headers = new Headers()
      headers.set("Content-Type", "application/json")
      headers.set("x-localstorage-funding-requests", JSON.stringify(lsRead()))
      const res = await fetch("/api/investor/funding-requests", {
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

  const setStatus = useCallback(
    async (id: string, status: FundingRequest["status"]) => {
      const headers = new Headers()
      headers.set("Content-Type", "application/json")
      headers.set("x-localstorage-funding-requests", JSON.stringify(lsRead()))
      const res = await fetch("/api/investor/funding-requests", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, status }),
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
          <div className="text-white text-xl font-bold">Funding Requests</div>
          <p className="text-sm text-gray-300">Manage incoming funding proposals.</p>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <input
          className="rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 px-3 py-2"
          placeholder="Startup"
          value={startup}
          onChange={(e) => setStartup(e.target.value)}
        />
        <input
          className="rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 px-3 py-2"
          placeholder="Amount (USD)"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700"
        >
          <Plus size={16} /> Add Request
        </button>
      </div>

      <textarea
        className="mt-3 w-full rounded-md border border-white/20 bg-white/10 text-white placeholder:text-white/60 px-3 py-2 min-h-24"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="mt-5">
        {empty ? (
          <p className="text-sm text-gray-300">No funding requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">
                    {r.startup} <span className="text-white/60 font-normal">· ${r.amount.toLocaleString()}</span>
                  </div>
                  {r.notes ? <div className="text-xs text-white/80 mt-1 line-clamp-2">{r.notes}</div> : null}
                  <div className="text-[11px] text-white/60 mt-1">
                    {new Date(r.createdAt).toLocaleString()} •{" "}
                    <span
                      className={
                        r.status === "approved"
                          ? "text-emerald-300"
                          : r.status === "declined"
                            ? "text-red-300"
                            : "text-yellow-300"
                      }
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setStatus(r.id, "approved")}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600/80 hover:bg-emerald-600 text-white px-2 py-1 text-xs"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "declined")}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white px-2 py-1 text-xs"
                  >
                    <X size={14} /> Decline
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-xs"
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
