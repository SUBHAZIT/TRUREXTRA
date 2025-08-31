"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Topic = {
  id: string
  title: string
  body?: string
}

const LS_KEY = "inst_topics"

export default function CommunityHubPanel() {
  const [topics, setTopics] = useLocalStorage<Topic[]>(LS_KEY, [])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  function addTopic() {
    if (!title.trim()) return
    const t: Topic = { id: crypto.randomUUID(), title: title.trim(), body: body.trim() || undefined }
    setTopics((prev) => [t, ...prev])
    setTitle("")
    setBody("")
  }

  function remove(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">INTERNAL FORUM, CLUBS, AND KNOWLEDGE-SHARING SPACE.</p>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="border-border/50 bg-background/20">
          OPEN FORUM
        </Button>
        <Button variant="outline" className="border-border/50 bg-background/20">
          MANAGE CLUBS
        </Button>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="topic-title">TOPIC</Label>
            <Input
              id="topic-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="TOPIC TITLE"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="topic-body">DETAILS (OPTIONAL)</Label>
            <Textarea
              id="topic-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="SUMMARY OR NOTES"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addTopic}>
            POST
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setTitle("")
              setBody("")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOPICS: {topics.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {topics.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO POSTS YET.</li>
          ) : (
            topics.map((t) => (
              <li key={t.id} className="p-4">
                <div className="font-semibold">{t.title}</div>
                {t.body ? <div className="text-xs text-foreground/70 whitespace-pre-wrap">{t.body}</div> : null}
                <div className="mt-2">
                  <Button variant="outline" className="border-border/60 bg-background/20" onClick={() => remove(t.id)}>
                    REMOVE
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
