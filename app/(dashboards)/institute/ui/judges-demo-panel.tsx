"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

type Entry = {
  id: string
  team: string
  project: string
  score: number
  notes?: string
}

const LS_KEY = "institute_judges_demo"

export default function JudgesDemoPanel() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [team, setTeam] = useState("")
  const [project, setProject] = useState("")
  const [score, setScore] = useState<number | "">("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY)
      if (raw) setEntries(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(entries))
    } catch {
      // ignore
    }
  }, [entries])

  const ranked = useMemo(() => [...entries].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)), [entries])

  function resetForm() {
    setTeam("")
    setProject("")
    setScore("")
    setNotes("")
  }

  function addEntry() {
    if (!team.trim() || !project.trim() || score === "" || isNaN(Number(score))) return
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      team: team.trim(),
      project: project.trim(),
      score: Number(score),
      notes: notes.trim() || undefined,
    }
    setEntries((prev) => [newEntry, ...prev])
    resetForm()
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/80">OFFLINE JUDGING DEMO. DATA SAVED TO LOCAL STORAGE ONLY.</p>

      <div className="rounded-lg border border-border/50 bg-background/5 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="team">TEAM</Label>
            <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="TEAM NAME" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project">PROJECT</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="PROJECT NAME"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="score">SCORE</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0-100"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="notes">NOTES (OPTIONAL)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="BRIEF COMMENTS"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addEntry}>
            ADD ENTRY
          </Button>
          <Button
            variant="outline"
            className="border-border/50 bg-background/20"
            onClick={() => {
              resetForm()
            }}
          >
            RESET
          </Button>
          <Button
            variant="outline"
            className="ml-auto border-border/50 bg-background/20"
            onClick={() => {
              if (confirm("CLEAR ALL LOCAL ENTRIES?")) setEntries([])
            }}
          >
            CLEAR ALL
          </Button>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border border-border/50 bg-background/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RANK</TableHead>
              <TableHead>TEAM</TableHead>
              <TableHead>PROJECT</TableHead>
              <TableHead className="text-right">SCORE</TableHead>
              <TableHead>NOTES</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-foreground/70">
                  NO ENTRIES YET. ADD YOUR FIRST TEAM ABOVE.
                </TableCell>
              </TableRow>
            ) : (
              ranked.map((e, idx) => (
                <TableRow key={e.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{e.team}</TableCell>
                  <TableCell>{e.project}</TableCell>
                  <TableCell className="text-right">{e.score}</TableCell>
                  <TableCell className="max-w-[320px] whitespace-pre-wrap">{e.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/50 bg-background/20"
                      onClick={() => removeEntry(e.id)}
                    >
                      REMOVE
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
