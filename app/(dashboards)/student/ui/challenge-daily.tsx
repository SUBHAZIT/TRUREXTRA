"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ChallengeDaily() {
  const { data } = useSWR("/api/challenges?mode=daily", fetcher)
  const challenges = data?.data || []

  return (
    <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
          <span>🧠</span> Today's Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 && <p className="text-gray-400">No challenges available today.</p>}
        {challenges.map((challenge: any) => (
          <div key={challenge.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
            <div className="text-white">{challenge.title}</div>
            <Badge
              variant={
                challenge.difficulty.toLowerCase() === "easy"
                  ? "default"
                  : challenge.difficulty.toLowerCase() === "medium"
                  ? "secondary"
                  : "destructive"
              }
              className="capitalize text-xs"
            >
              {challenge.difficulty}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
