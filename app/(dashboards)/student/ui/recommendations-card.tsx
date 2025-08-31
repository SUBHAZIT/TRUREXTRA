"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RecommendationsCard() {
  const { data } = useSWR("/api/recommendations", fetcher)
  const items = data?.items || []

  return (
    <Card id="recommendations">
      <CardHeader>
        <CardTitle className="text-pretty">Recommended Next Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No recommendations yet.</p>}
        <ul className="list-disc pl-5">
          {items.map((it: any, idx: number) => (
            <li key={idx} className="text-sm">
              <a className="underline underline-offset-4" href={it.href}>
                {it.title}
              </a>{" "}
              <span className="text-muted-foreground">— {it.description}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
