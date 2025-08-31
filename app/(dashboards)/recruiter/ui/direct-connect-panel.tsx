"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Meeting = {
  id: string
  with: string
  when?: string
  method?: string // e.g., ZOOM, GOOGLE MEET, PHONE
}

export default function DirectConnectPanel() {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>("recruiter.meetings", [])
  const [form, setForm] = React.useState<Partial<Meeting>>({})

  const add = () => {
    if (!form.with) return
    setMeetings([...meetings, { id: crypto.randomUUID(), with: form.with!, when: form.when, method: form.method }])
    setForm({})
  }
  const remove = (id: string) => setMeetings(meetings.filter((m) => m.id !== id))

  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="CANDIDATE/CONTACT NAME"
            value={form.with || ""}
            onChange={(e) => setForm({ ...form, with: e.target.value })}
          />
          <Input
            placeholder="DATE & TIME"
            value={form.when || ""}
            onChange={(e) => setForm({ ...form, when: e.target.value })}
          />
          <Input
            placeholder="METHOD (ZOOM/MEET/PHONE)"
            value={form.method || ""}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
          />
        </div>
        <Button onClick={add} className="w-fit border border-white/20 bg-background/40 backdrop-blur-sm">
          SCHEDULE
        </Button>

        <div className="grid gap-2">
          {meetings.length === 0 ? (
            <p className="text-sm text-gray-400">NO MEETINGS SCHEDULED.</p>
          ) : (
            meetings.map((m) => (
              <div key={m.id} className="rounded-lg border border-white/15 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-white">{m.with}</div>
                    <div className="text-xs text-gray-400">{m.when || "-"}</div>
                    <div className="text-xs text-gray-400">{m.method || "-"}</div>
                  </div>
                  <Button variant="destructive" onClick={() => remove(m.id)}>
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
