"use client"

import { getAll, keys, removeOne, updateOne, type OrgEvent } from "../lib/local-db"
import { useEffect, useState } from "react"

export function EventsTable({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<OrgEvent[]>([])

  function refresh() {
    setRows(getAll<OrgEvent>(keys.events))
  }
  useEffect(refresh, [])

  function togglePublish(e: OrgEvent) {
    const updated = { ...e, status: e.status === "published" ? "draft" : "published" }
    updateOne<OrgEvent>(keys.events, updated)
    refresh()
  }
  function clone(e: OrgEvent) {
    const copy = {
      ...e,
      id: `${e.id}_copy_${Date.now()}`,
      title: `${e.title} (copy)`,
      createdAt: Date.now(),
      status: "draft" as const,
    }
    const cur = getAll<OrgEvent>(keys.events)
    localStorage.setItem(keys.events, JSON.stringify([copy, ...cur]))
    refresh()
  }
  function del(id: string) {
    removeOne(keys.events, id)
    refresh()
  }

  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No events yet. Create one on the left.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Created</th>
            <th className="py-2 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-t border-border">
              <td className="py-2 pr-4">{e.title}</td>
              <td className="py-2 pr-4">{e.type}</td>
              <td className="py-2 pr-4">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs border ${e.status === "published" ? "border-green-500/40 text-green-400 bg-green-500/10" : "border-yellow-500/40 text-yellow-300 bg-yellow-500/10"}`}
                >
                  {e.status}
                </span>
              </td>
              <td className="py-2 pr-4">{new Date(e.createdAt).toLocaleString()}</td>
              <td className="py-2 pr-0 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                    onClick={() => togglePublish(e)}
                  >
                    {e.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                    onClick={() => clone(e)}
                  >
                    Clone
                  </button>
                  <button
                    className="rounded bg-destructive text-destructive-foreground px-2 py-1 hover:opacity-90"
                    onClick={() => del(e.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
