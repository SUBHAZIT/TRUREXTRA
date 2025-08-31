"use client"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function JobsBrowser() {
  const { data } = useSWR("/api/jobs", fetcher)
  const jobs = data?.data || []
  const [noteById, setNoteById] = useState<Record<string, string>>({})

  const apply = async (job_id: string) => {
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id, note: noteById[job_id] || "" }),
    })
    alert("Applied!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Jobs & Internships</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs yet.</p>}
        {jobs.map((j: any) => (
          <div key={j.id} className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{j.title}</div>
              <div className="text-sm text-muted-foreground">{j.location || "Remote"}</div>
            </div>
            <div className="text-sm">{j.description}</div>
            <div className="mt-2 flex items-center gap-2">
              <Textarea
                placeholder="Optional note"
                value={noteById[j.id] || ""}
                onChange={(e) => setNoteById((prev) => ({ ...prev, [j.id]: e.target.value }))}
              />
              <Button onClick={() => apply(j.id)}>Apply</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
