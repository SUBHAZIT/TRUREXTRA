"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Team = {
  id: string
  name: string
  score?: number
}

export default function JudgesDemoPanel() {
  const [teams, setTeams] = useLocalStorage<Team[]>("recruiter.judgesDemo", [])
  const [form, setForm] = React.useState<Partial<Team>>({})

  const add = () => {
    if (!form.name) return
    setTeams([
      ...teams,
      { id: crypto.randomUUID(), name: form.name!, score: form.score ? Number(form.score) : undefined },
    ])
    setForm({})
  }
  const remove = (id: string) => setTeams(teams.filter((t) => t.id !== id))
  const rank = () => setTeams([...teams].sort((a, b) => (b.score ?? -1) - (a.score ?? -1)))
  const clearAll = () => setTeams([])

  return (
    <Card className="border-white/15 bg-background/30 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">HACKATHON DEMO (JUDGES)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="TEAM NAME"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="SCORE (0-100)"
            type="number"
            value={form.score ?? ""}
            onChange={(e) => setForm({ ...form, score: Number(e.target.value) || undefined })}
          />
          <Button onClick={add} className="border border-white/20 bg-background/40 backdrop-blur-sm">
            ADD TEAM
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={rank} className="border border-white/20 bg-background/40 backdrop-blur-sm">
            RANK BY SCORE
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            CLEAR ALL
          </Button>
        </div>
        <div className="grid gap-2">
          {teams.length === 0 ? (
            <p className="text-sm text-foreground/80">NO TEAMS ADDED.</p>
          ) : (
            teams.map((t, idx) => (
              <div key={t.id} className="rounded-lg border border-white/15 bg-background/25 p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      #{idx + 1} · {t.name}
                    </div>
                    <div className="text-xs text-foreground/80">SCORE: {t.score ?? "-"}</div>
                  </div>
                  <Button variant="destructive" onClick={() => remove(t.id)}>
                    REMOVE
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
