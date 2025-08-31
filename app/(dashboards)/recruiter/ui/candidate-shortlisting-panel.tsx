"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Shortlisted = {
  id: string
  name: string
  role?: string
  rank?: number
}

export default function CandidateShortlistingPanel() {
  const [list, setList] = useLocalStorage<Shortlisted[]>("recruiter.shortlist", [])
  const [form, setForm] = React.useState<Partial<Shortlisted>>({})

  const add = () => {
    if (!form.name) return
    const item: Shortlisted = {
      id: crypto.randomUUID(),
      name: form.name!,
      role: form.role,
      rank: form.rank ? Number(form.rank) : undefined,
    }
    setList([...list, item])
    setForm({})
  }

  const remove = (id: string) => setList(list.filter((i) => i.id !== id))
  const sortByRank = () => setList([...list].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)))

  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="NAME"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="ROLE"
            value={form.role || ""}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <Input
            placeholder="RANK (NUMBER)"
            type="number"
            value={form.rank ?? ""}
            onChange={(e) => setForm({ ...form, rank: Number(e.target.value) || undefined })}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={add} className="border border-white/20 bg-background/40 backdrop-blur-sm">
            ADD
          </Button>
          <Button
            variant="secondary"
            onClick={sortByRank}
            className="border border-white/20 bg-background/40 backdrop-blur-sm"
          >
            SORT BY RANK
          </Button>
        </div>

        <div className="grid gap-2">
          {list.length === 0 ? (
            <p className="text-sm text-gray-400">NO SHORTLISTED CANDIDATES.</p>
          ) : (
            list.map((i) => (
              <div key={i.id} className="rounded-lg border border-white/15 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-white">{i.name}</div>
                    <div className="text-xs text-gray-400">ROLE: {i.role || "-"}</div>
                    <div className="text-xs text-gray-400">RANK: {i.rank ?? "-"}</div>
                  </div>
                  <Button variant="destructive" onClick={() => remove(i.id)}>
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
