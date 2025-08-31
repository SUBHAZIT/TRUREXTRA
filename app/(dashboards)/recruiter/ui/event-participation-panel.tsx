"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type EventItem = {
  id: string
  name: string
  date?: string
  link?: string
}

export default function EventParticipationPanel() {
  const [events, setEvents] = useLocalStorage<EventItem[]>("recruiter.events", [])
  const [form, setForm] = React.useState<Partial<EventItem>>({})

  const add = () => {
    if (!form.name) return
    setEvents([...events, { id: crypto.randomUUID(), name: form.name!, date: form.date, link: form.link }])
    setForm({})
  }
  const remove = (id: string) => setEvents(events.filter((e) => e.id !== id))

  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="EVENT NAME"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="DATE"
            value={form.date || ""}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            placeholder="LINK"
            value={form.link || ""}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </div>
        <Button onClick={add} className="w-fit border border-white/20 bg-background/40 backdrop-blur-sm">
          ADD
        </Button>

        <div className="grid gap-2">
          {events.length === 0 ? (
            <p className="text-sm text-gray-400">NO EVENTS.</p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="rounded-lg border border-white/15 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-white">{e.name}</div>
                    <div className="text-xs text-gray-400">{e.date || "-"}</div>
                    {e.link && (
                      <a className="text-xs underline text-blue-400" href={e.link} target="_blank" rel="noreferrer">
                        LINK
                      </a>
                    )}
                  </div>
                  <Button variant="destructive" onClick={() => remove(e.id)}>
                    REMOVE
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
