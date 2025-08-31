"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Leaderboard() {
  const { data } = useSWR("/api/leaderboard", fetcher)
  const rows = data?.top || []
  const me = data?.me

  return (
    <Card id="leaderboard">
      <CardHeader>
        <CardTitle className="text-pretty">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No data yet. Solve a challenge to get started.</p>
        )}
        <div className="flex flex-col gap-2">
          {rows.map((r: any) => (
            <div key={r.user_id} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-semibold">{r.rank}</span>
                <span className="font-medium">{r.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">{r.solved_count} solved</div>
            </div>
          ))}
        </div>
        {me && (
          <div className="rounded-md border p-2 text-sm">
            Your rank: <span className="font-medium">{me.rank}</span> · Solved:{" "}
            <span className="font-medium">{me.solved_count}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
