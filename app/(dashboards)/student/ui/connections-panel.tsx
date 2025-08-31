"use client"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ConnectionsPanel() {
  const { data, mutate } = useSWR("/api/connections", fetcher)
  const items = data?.data || []

  const accept = async (id: string) => {
    await fetch("/api/connections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "accepted" }),
    })
    mutate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Connections</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No connection activity yet.</p>}
        {items.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between border rounded-md p-2">
            <div className="text-sm">
              <div className="font-medium">
                {c.requester} → {c.addressee}
              </div>
              <div className="text-muted-foreground">Status: {c.status}</div>
            </div>
            {c.status === "pending" && (
              <Button variant="outline" size="sm" onClick={() => accept(c.id)}>
                Accept
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
