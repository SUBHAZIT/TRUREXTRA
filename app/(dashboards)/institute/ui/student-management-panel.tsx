"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Student = {
  id: string
  name: string
  program?: string
  skills?: string[]
}

const LS_KEY = "inst_students"

export default function StudentManagementPanel() {
  const [students, setStudents] = useLocalStorage<Student[]>(LS_KEY, [])
  const [name, setName] = useState("")
  const [program, setProgram] = useState("")
  const [skills, setSkills] = useState("")

  function addStudent() {
    if (!name.trim()) return
    const s: Student = {
      id: crypto.randomUUID(),
      name: name.trim(),
      program: program.trim() || undefined,
      skills: skills
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    }
    setStudents((prev) => [s, ...prev])
    setName("")
    setProgram("")
    setSkills("")
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">TRACK STUDENT PARTICIPATION, SKILLS, AND ACHIEVEMENTS.</p>
      <Separator className="my-3" />

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="student-name">NAME</Label>
            <Input id="student-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="FULL NAME" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="student-program">PROGRAM</Label>
            <Input
              id="student-program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="PROGRAM / YEAR"
            />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label htmlFor="student-skills">SKILLS (CSV)</Label>
            <Input
              id="student-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JS, REACT, ML"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addStudent}>
            ADD STUDENT
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setName("")
              setProgram("")
              setSkills("")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOTAL: {students.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {students.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO STUDENTS YET.</li>
          ) : (
            students.map((s) => (
              <li key={s.id} className="p-4 flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-foreground/70 break-words">
                    {s.program || "-"}
                    {s.skills && s.skills.length ? ` • SKILLS: ${s.skills.join(", ")}` : ""}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-border/60 bg-background/20"
                  onClick={() => removeStudent(s.id)}
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
