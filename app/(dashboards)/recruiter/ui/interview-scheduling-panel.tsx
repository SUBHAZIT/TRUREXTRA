"use client"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Interview = {
  id: string
  candidate: string
  role: string
  datetime: string
  mode: "IN-PERSON" | "VIDEO" | "PHONE"
}

export default function InterviewSchedulingPanel() {
  const [items, setItems] = useLocalStorage<Interview[]>("recruiter_interviews", [])
  const [candidate, setCandidate] = useState("")
  const [role, setRole] = useState("")
  const [datetime, setDatetime] = useState("")
  const [mode, setMode] = useState<Interview["mode"]>("VIDEO")

  function add() {
    if (!candidate || !role || !datetime) return
    const next: Interview = { id: crypto.randomUUID(), candidate, role, datetime, mode }
    setItems([next, ...items])
    setCandidate("")
    setRole("")
    setDatetime("")
    setMode("VIDEO")
  }

  function remove(id: string) {
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">INTERVIEW SCHEDULING</h2>
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="CANDIDATE" value={candidate} onChange={(e) => setCandidate(e.target.value)} />
        <Input placeholder="ROLE" value={role} onChange={(e) => setRole(e.target.value)} />
        <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select value={mode} onValueChange={(v: Interview["mode"]) => setMode(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="MODE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN-PERSON">IN-PERSON</SelectItem>
              <SelectItem value="VIDEO">VIDEO</SelectItem>
              <SelectItem value="PHONE">PHONE</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={add} className="shrink-0">
            ADD
          </Button>
        </div>
      </div>

      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-foreground/70">NO INTERVIEWS SCHEDULED</li>}
        {items.map((i) => (
          <li
            key={i.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/20 p-3"
          >
            <div className="space-y-1">
              <div className="font-medium">
                {i.candidate} — {i.role}
              </div>
              <div className="text-xs text-foreground/70">{new Date(i.datetime).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs rounded-full border border-border/60 bg-background/30 px-2 py-1">{i.mode}</span>
              <Button variant="destructive" onClick={() => remove(i.id)}>
                REMOVE
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
