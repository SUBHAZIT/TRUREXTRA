"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Person = { id: string; name: string; role?: string }

const LS_MENTORS = "inst_mentors"
const LS_ALUMNI = "inst_alumni"

export default function MentorAlumniPanel() {
  const [mentors, setMentors] = useLocalStorage<Person[]>(LS_MENTORS, [])
  const [alumni, setAlumni] = useLocalStorage<Person[]>(LS_ALUMNI, [])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [target, setTarget] = useState<"MENTOR" | "ALUMNI">("MENTOR")

  function addPerson() {
    if (!name.trim()) return
    const p: Person = { id: crypto.randomUUID(), name: name.trim(), role: role.trim() || undefined }
    if (target === "MENTOR") setMentors((prev) => [p, ...prev])
    else setAlumni((prev) => [p, ...prev])
    setName("")
    setRole("")
  }

  function remove(setter: (fn: any) => void, list: Person[], id: string) {
    setter(list.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">INVITE MENTORS AND ALUMNI TO GUIDE STUDENTS.</p>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="ma-target">ADD TO</Label>
            <select
              id="ma-target"
              className="h-9 rounded-md border border-border/60 bg-background/20 px-2"
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
            >
              <option>MENTOR</option>
              <option>ALUMNI</option>
            </select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="ma-name">NAME</Label>
            <Input id="ma-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="FULL NAME" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ma-role">ROLE (OPTIONAL)</Label>
            <Input
              id="ma-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="EXPERTISE / TITLE"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addPerson}>
            INVITE
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setName("")
              setRole("")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">
            MENTORS: {mentors.length} • ALUMNI: {alumni.length}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
          <div className="p-3 font-semibold">MENTORS</div>
          <ul className="divide-y divide-border/40">
            {mentors.length === 0 ? (
              <li className="p-4 text-center text-foreground/70">NO MENTORS.</li>
            ) : (
              mentors.map((m) => (
                <li key={m.id} className="p-3 flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-foreground/70">{m.role || "-"}</div>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-auto border-border/60 bg-background/20"
                    onClick={() => remove(setMentors, mentors, m.id)}
                  >
                    REMOVE
                  </Button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
          <div className="p-3 font-semibold">ALUMNI</div>
          <ul className="divide-y divide-border/40">
            {alumni.length === 0 ? (
              <li className="p-4 text-center text-foreground/70">NO ALUMNI.</li>
            ) : (
              alumni.map((a) => (
                <li key={a.id} className="p-3 flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-foreground/70">{a.role || "-"}</div>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-auto border-border/60 bg-background/20"
                    onClick={() => remove(setAlumni, alumni, a.id)}
                  >
                    REMOVE
                  </Button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
