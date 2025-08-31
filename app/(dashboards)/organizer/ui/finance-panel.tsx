"use client"

import { useEffect, useMemo, useState } from "react"
import { addOne, getAll, keys, uid, type OrgEvent, type Transaction } from "../lib/local-db"

export function FinancePanel() {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [rows, setRows] = useState<Transaction[]>([])

  function refresh() {
    setEvents(getAll<OrgEvent>(keys.events))
    setRows(getAll<Transaction>(keys.transactions))
  }
  useEffect(refresh, [])

  function addTx() {
    const eventId = (document.getElementById("txevent") as HTMLSelectElement).value || undefined
    const gateway = (document.getElementById("txgw") as HTMLSelectElement).value as Transaction["gateway"]
    const amount = Number((document.getElementById("txamt") as HTMLInputElement).value || "0")
    const currency = (document.getElementById("txcur") as HTMLInputElement).value || "INR"
    const status = (document.getElementById("txstatus") as HTMLSelectElement).value as Transaction["status"]
    addOne<Transaction>(keys.transactions, {
      id: uid("tx"),
      eventId,
      gateway,
      amount,
      currency,
      status,
      createdAt: Date.now(),
    })
    refresh()
  }

  const total = useMemo(() => rows.filter((r) => r.status === "success").reduce((s, r) => s + r.amount, 0), [rows])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-6 gap-2">
        <select id="txevent" className="rounded-md border border-border bg-background px-3 py-2">
          <option value="">no event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <select id="txgw" className="rounded-md border border-border bg-background px-3 py-2">
          <option>Stripe</option>
          <option>Razorpay</option>
          <option>PayPal</option>
          <option>Manual</option>
        </select>
        <input
          id="txamt"
          type="number"
          placeholder="Amount"
          className="rounded-md border border-border bg-background px-3 py-2"
        />
        <input
          id="txcur"
          placeholder="Currency"
          defaultValue="INR"
          className="rounded-md border border-border bg-background px-3 py-2"
        />
        <select id="txstatus" className="rounded-md border border-border bg-background px-3 py-2">
          <option>success</option>
          <option>failed</option>
          <option>pending</option>
        </select>
        <button
          onClick={addTx}
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
        >
          Add
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        Total Successful Revenue: <span className="text-foreground font-semibold">₹{total.toLocaleString()}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Gateway</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Currency</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Event</th>
              <th className="py-2 pr-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="py-2 pr-4">{t.gateway}</td>
                <td className="py-2 pr-4">₹{t.amount.toLocaleString()}</td>
                <td className="py-2 pr-4">{t.currency}</td>
                <td className="py-2 pr-4">{t.status}</td>
                <td className="py-2 pr-4">{events.find((e) => e.id === t.eventId)?.title || "-"}</td>
                <td className="py-2 pr-4">{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
