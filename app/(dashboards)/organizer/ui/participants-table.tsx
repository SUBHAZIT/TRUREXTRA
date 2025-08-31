"use client"

import { useEffect, useMemo, useState } from "react"
import { addOne, getAll, keys, uid, updateOne, type OrgEvent, type Participant } from "../lib/local-db"

export function ParticipantsTable() {
  const [rows, setRows] = useState<Participant[]>([])
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [filter, setFilter] = useState<{
    role: "all" | "student" | "professional" | "mentor"
    status: "all" | "pending" | "approved" | "rejected"
    eventId: "all" | string
  }>({ role: "all", status: "all", eventId: "all" })

  function refresh() {
    setRows(getAll<Participant>(keys.participants))
    setEvents(getAll<OrgEvent>(keys.events))
  }
  useEffect(refresh, [])

  function addSample(p: Omit<Participant, "id" | "createdAt">) {
    addOne<Participant>(keys.participants, { ...p, id: uid("p"), createdAt: Date.now() })
    refresh()
  }

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter.role === "all" || r.role === filter.role) &&
          (filter.status === "all" || r.status === filter.status) &&
          (filter.eventId === "all" || r.eventId === filter.eventId),
      ),
    [rows, filter],
  )

  function setStatus(id: string, status: Participant["status"]) {
    const found = rows.find((r) => r.id === id)
    if (!found) return
    updateOne<Participant>(keys.participants, { ...found, status })
    refresh()
  }

  function exportCSV() {
    const header = "name,email,role,event,status,createdAt\n"
    const lines = filtered.map(
      (r) =>
        `${r.name},${r.email},${r.role},${events.find((e) => e.id === r.eventId)?.title || ""},${r.status},${new Date(r.createdAt).toISOString()}`,
    )
    const blob = new Blob([header + lines.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "participants.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Add participant */}
      <div className="grid md:grid-cols-5 gap-2">
        <input placeholder="Name" className="rounded-md border border-border bg-background px-3 py-2" id="pname" />
        <input placeholder="Email" className="rounded-md border border-border bg-background px-3 py-2" id="pemail" />
        <select className="rounded-md border border-border bg-background px-3 py-2" id="prole">
          <option value="student">student</option>
          <option value="professional">professional</option>
          <option value="mentor">mentor</option>
        </select>
        <select className="rounded-md border border-border bg-background px-3 py-2" id="pevent">
          <option value="">no event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <button
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
          onClick={() => {
            const name = (document.getElementById("pname") as HTMLInputElement).value
            const email = (document.getElementById("pemail") as HTMLInputElement).value
            const role = (document.getElementById("prole") as HTMLSelectElement).value as any
            const ev = (document.getElementById("pevent") as HTMLSelectElement).value
            if (!name || !email) return alert("Name and email required")
            addSample({ name, email, role, eventId: ev || undefined, status: "pending" })
          }}
        >
          Add
        </button>
      </div>

      {/* Filters & export */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="rounded-md border border-border bg-background px-3 py-2"
          value={filter.role}
          onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value as any }))}
        >
          <option value="all">role: all</option>
          <option value="student">student</option>
          <option value="professional">professional</option>
          <option value="mentor">mentor</option>
        </select>
        <select
          className="rounded-md border border-border bg-background px-3 py-2"
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as any }))}
        >
          <option value="all">status: all</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
        <select
          className="rounded-md border border-border bg-background px-3 py-2"
          value={filter.eventId}
          onChange={(e) => setFilter((f) => ({ ...f, eventId: e.target.value as any }))}
        >
          <option value="all">event: all</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <button
          className="rounded-md border border-border bg-muted px-3 py-2 text-sm hover:bg-muted/80"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Event</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2 pr-4">{r.name}</td>
                <td className="py-2 pr-4">{r.email}</td>
                <td className="py-2 pr-4">{r.role}</td>
                <td className="py-2 pr-4">{events.find((e) => e.id === r.eventId)?.title || "-"}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs border ${
                      r.status === "approved"
                        ? "border-green-500/40 text-green-400 bg-green-500/10"
                        : r.status === "rejected"
                          ? "border-red-500/40 text-red-300 bg-red-500/10"
                          : "border-yellow-500/40 text-yellow-300 bg-yellow-500/10"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-2 pr-0 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                      onClick={() => setStatus(r.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                      onClick={() => setStatus(r.id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="rounded border border-border bg-muted px-2 py-1 hover:bg-muted/80"
                      onClick={() => setStatus(r.id, "pending")}
                    >
                      Reset
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No participants
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
