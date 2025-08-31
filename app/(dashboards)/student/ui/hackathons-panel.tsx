"use client"
import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function HackathonsPanel() {
  const { data: eventsResp } = useSWR("/api/events", fetcher)
  const events = eventsResp?.data || []
  const { data: teamsResp, mutate } = useSWR("/api/hackathons/teams", fetcher)
  const teams = teamsResp?.data || []
  const [teamNameByEvent, setTeamNameByEvent] = useState<Record<string, string>>({})
  const [repoByTeam, setRepoByTeam] = useState<Record<string, string>>({})
  const [demoByTeam, setDemoByTeam] = useState<Record<string, string>>({})
  const [descByTeam, setDescByTeam] = useState<Record<string, string>>({})

  const createTeam = async (event_id: string) => {
    const name = teamNameByEvent[event_id]
    if (!name) return
    await fetch("/api/hackathons/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id, name }),
    })
    setTeamNameByEvent((prev) => ({ ...prev, [event_id]: "" }))
    mutate()
  }

  const submitProject = async (team_id: string) => {
    await fetch("/api/hackathons/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_id,
        repo_url: repoByTeam[team_id] || "",
        demo_url: demoByTeam[team_id] || "",
        description: descByTeam[team_id] || "",
      }),
    })
    alert("Submitted!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Hackathons & Teams</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="font-medium mb-2">Upcoming Events</div>
          {events.length === 0 && <div className="text-sm text-muted-foreground">No events yet.</div>}
          <div className="flex flex-col gap-2">
            {events.map((e: any) => (
              <div key={e.id} className="border rounded-md p-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{e.name || e.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(e.starts_at || e.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    placeholder="Team name"
                    value={teamNameByEvent[e.id] || ""}
                    onChange={(ev) => setTeamNameByEvent((prev) => ({ ...prev, [e.id]: ev.target.value }))}
                  />
                  <Button onClick={() => createTeam(e.id)}>Create team</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">My Teams</div>
          {teams.length === 0 && <div className="text-sm text-muted-foreground">You are not in a team yet.</div>}
          <div className="flex flex-col gap-2">
            {teams.map((t: any) => (
              <div key={t.id} className="border rounded-md p-2">
                <div className="font-medium">{t.name}</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Repo URL"
                    value={repoByTeam[t.id] || ""}
                    onChange={(ev) => setRepoByTeam((prev) => ({ ...prev, [t.id]: ev.target.value }))}
                  />
                  <Input
                    placeholder="Demo URL"
                    value={demoByTeam[t.id] || ""}
                    onChange={(ev) => setDemoByTeam((prev) => ({ ...prev, [t.id]: ev.target.value }))}
                  />
                  <Input
                    placeholder="Short description"
                    value={descByTeam[t.id] || ""}
                    onChange={(ev) => setDescByTeam((prev) => ({ ...prev, [t.id]: ev.target.value }))}
                  />
                </div>
                <div className="mt-2">
                  <Button onClick={() => submitProject(t.id)}>Submit Project</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
