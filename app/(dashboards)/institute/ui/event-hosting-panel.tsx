"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/use-local-storage"

type EventItem = {
  id: string
  title: string
  kind?: "HACKATHON" | "WORKSHOP" | "COMPETITION"
  date?: string
  status?: "UPCOMING" | "ONGOING" | "ENDED"
}

const LS_KEY = "inst_events"

export default function EventHostingPanel() {
  const [events, setEvents] = useLocalStorage<EventItem[]>(LS_KEY, [])
  const [title, setTitle] = useState("")
  const [kind, setKind] = useState<EventItem["kind"]>("HACKATHON")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState<EventItem["status"]>("UPCOMING")

  function addEvent() {
    if (!title.trim()) return
    const e: EventItem = { id: crypto.randomUUID(), title: title.trim(), kind, date: date || undefined, status }
    setEvents((prev) => [e, ...prev])
    setTitle("")
    setDate("")
    setKind("HACKATHON")
    setStatus("UPCOMING")
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">CREATE AND MANAGE HACKATHONS, WORKSHOPS, AND COMPETITIONS.</p>
      <Separator className="my-3" />

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="ev-title">TITLE</Label>
            <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="EVENT TITLE" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-kind">TYPE</Label>
            <select
              id="ev-kind"
              className="h-9 rounded-md border border-border/60 bg-background/20 px-2"
              value={kind}
              onChange={(e) => setKind(e.target.value as EventItem["kind"])}
            >
              <option>HACKATHON</option>
              <option>WORKSHOP</option>
              <option>COMPETITION</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-date">DATE</Label>
            <Input id="ev-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-status">STATUS</Label>
            <select
              id="ev-status"
              className="h-9 rounded-md border border-border/60 bg-background/20 px-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventItem["status"])}
            >
              <option>UPCOMING</option>
              <option>ONGOING</option>
              <option>ENDED</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addEvent}>
            CREATE EVENT
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setTitle("")
              setKind("HACKATHON")
              setDate("")
              setStatus("UPCOMING")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOTAL: {events.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {events.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO EVENTS YET.</li>
          ) : (
            events.map((e) => (
              <li key={e.id} className="p-4 flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-semibold break-words">{e.title}</div>
                  <div className="text-xs text-foreground/70">
                    {e.kind || "-"} {e.date ? `• ${e.date}` : ""} {e.status ? `• ${e.status}` : ""}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-border/60 bg-background/20"
                  onClick={() => removeEvent(e.id)}
                >
                  REMOVE
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
