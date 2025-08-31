"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Job = {
  id: string
  title: string
  type: "JOB" | "INTERNSHIP"
  location?: string
  description?: string
}

export default function JobPostingPanel() {
  const [jobs, setJobs] = useLocalStorage<Job[]>("recruiter.jobs", [])
  const [form, setForm] = React.useState<Partial<Job>>({ type: "JOB" })

  const add = () => {
    if (!form.title || !form.type) return
    const item: Job = {
      id: crypto.randomUUID(),
      title: form.title!,
      type: (form.type as Job["type"]) || "JOB",
      location: form.location,
      description: form.description,
    }
    setJobs([...jobs, item])
    setForm({ type: "JOB" })
  }
  const remove = (id: string) => setJobs(jobs.filter((j) => j.id !== id))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">JOB & INTERNSHIP POSTING</h2>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="TITLE"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            placeholder="TYPE (JOB/INTERNSHIP)"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value.toUpperCase() as Job["type"] })}
          />
          <Input
            placeholder="LOCATION"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            placeholder="DESCRIPTION (SHORT)"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <Button onClick={add} className="w-fit border border-white/20 bg-background/40 backdrop-blur-sm">
          POST
        </Button>

        <div className="grid gap-2">
          {jobs.length === 0 ? (
            <p className="text-sm text-foreground/80">NO POSTINGS YET.</p>
          ) : (
            jobs.map((j) => (
              <div key={j.id} className="rounded-lg border border-white/15 bg-background/25 p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      {j.title} · {j.type}
                    </div>
                    <div className="text-xs text-foreground/80">{j.location || "-"}</div>
                    {j.description && <div className="text-xs text-foreground/80 break-words">{j.description}</div>}
                  </div>
                  <Button variant="destructive" onClick={() => remove(j.id)}>
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
