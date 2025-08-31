"use client"
import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function EndorsementsWidget({ endorsedUserId }: { endorsedUserId: string }) {
  const { data, mutate } = useSWR("/api/endorsements", fetcher)
  const [skill, setSkill] = useState("")

  const onEndorse = async () => {
    if (!skill.trim()) return
    await fetch("/api/endorsements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endorsed_user: endorsedUserId, skill }),
    })
    setSkill("")
    mutate()
  }

  const myEndorsements = data?.data?.filter((e: any) => e.endorsed_user === endorsedUserId) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Skill Endorsements</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Add a skill (e.g., React)" value={skill} onChange={(e) => setSkill(e.target.value)} />
          <Button onClick={onEndorse}>Endorse</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {myEndorsements.map((e: any) => (
            <span key={e.id} className="rounded-md border px-2 py-1 text-sm">
              {e.skill}
            </span>
          ))}
          {myEndorsements.length === 0 && <span className="text-sm text-muted-foreground">No endorsements yet.</span>}
        </div>
      </CardContent>
    </Card>
  )
}
