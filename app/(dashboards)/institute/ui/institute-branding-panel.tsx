"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Story = { id: string; title: string; summary?: string; link?: string }

const LS_KEY = "inst_branding"

export default function InstituteBrandingPanel() {
  const [stories, setStories] = useLocalStorage<Story[]>(LS_KEY, [])
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [link, setLink] = useState("")

  function addStory() {
    if (!title.trim()) return
    const s: Story = {
      id: crypto.randomUUID(),
      title: title.trim(),
      summary: summary.trim() || undefined,
      link: link.trim() || undefined,
    }
    setStories((prev) => [s, ...prev])
    setTitle("")
    setSummary("")
    setLink("")
  }

  function remove(id: string) {
    setStories((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">SHOWCASE INSTITUTE ACHIEVEMENTS, SUCCESS STORIES, AND PARTNERSHIPS.</p>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="story-title">TITLE</Label>
            <Input
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="AWARD / ACHIEVEMENT"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="story-summary">SUMMARY (OPTIONAL)</Label>
            <Textarea
              id="story-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="BRIEF DESCRIPTION"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="story-link">LINK (OPTIONAL)</Label>
            <Input id="story-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="HTTPS://..." />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addStory}>
            ADD STORY
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setTitle("")
              setSummary("")
              setLink("")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOTAL: {stories.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {stories.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO STORIES YET.</li>
          ) : (
            stories.map((s) => (
              <li key={s.id} className="p-4">
                <div className="font-semibold">{s.title}</div>
                {s.summary ? <div className="text-xs text-foreground/70 whitespace-pre-wrap">{s.summary}</div> : null}
                {s.link ? (
                  <a
                    className="mt-1 block text-xs underline text-foreground/80 break-words"
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.link}
                  </a>
                ) : null}
                <div className="mt-2">
                  <Button variant="outline" className="border-border/60 bg-background/20" onClick={() => remove(s.id)}>
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
