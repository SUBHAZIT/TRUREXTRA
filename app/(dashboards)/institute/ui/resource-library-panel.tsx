"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Resource = { id: string; title: string; link?: string; kind?: "PAPER" | "VIDEO" | "DOC" | "OTHER" }

const LS_KEY = "inst_resources"

export default function ResourceLibraryPanel() {
  const [resources, setResources] = useLocalStorage<Resource[]>(LS_KEY, [])
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [kind, setKind] = useState<Resource["kind"]>("PAPER")

  function addResource() {
    if (!title.trim()) return
    const r: Resource = { id: crypto.randomUUID(), title: title.trim(), link: link.trim() || undefined, kind }
    setResources((prev) => [r, ...prev])
    setTitle("")
    setLink("")
    setKind("PAPER")
  }

  function remove(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">UPLOAD AND MANAGE STUDY MATERIALS, RESEARCH PAPERS, AND RECORDINGS.</p>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="res-title">TITLE</Label>
            <Input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="RESOURCE TITLE"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="res-link">LINK (OPTIONAL)</Label>
            <Input id="res-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="HTTPS://..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-kind">TYPE</Label>
            <select
              id="res-kind"
              className="h-9 rounded-md border border-border/60 bg-background/20 px-2"
              value={kind}
              onChange={(e) => setKind(e.target.value as Resource["kind"])}
            >
              <option>PAPER</option>
              <option>VIDEO</option>
              <option>DOC</option>
              <option>OTHER</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addResource}>
            ADD RESOURCE
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setTitle("")
              setLink("")
              setKind("PAPER")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOTAL: {resources.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {resources.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO RESOURCES YET.</li>
          ) : (
            resources.map((r) => (
              <li key={r.id} className="p-4 flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-foreground/70 break-words">
                    {r.kind || "OTHER"} {r.link ? `• ${r.link}` : ""}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-border/60 bg-background/20"
                  onClick={() => remove(r.id)}
                >
                  REMOVE
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
