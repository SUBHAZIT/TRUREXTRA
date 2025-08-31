"use client"

import { useEffect, useState } from "react"
import { addOne, getAll, keys, uid, type Message } from "../lib/local-db"

export function CommunicationPanel() {
  const [rows, setRows] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  function refresh() {
    setRows(getAll<Message>(keys.messages))
  }
  useEffect(refresh, [])

  async function askAI() {
    const title = (document.getElementById("mtitle") as HTMLInputElement).value
    const body = (document.getElementById("mbody") as HTMLTextAreaElement).value
    setLoading(true)
    try {
      const res = await fetch("/api/helpbot", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an assistant for event organizers. Suggest concise, energetic marketing copy.",
            },
            { role: "user", content: `Draft a short email or announcement for: ${title}\n\nContext: ${body}` },
          ],
        }),
      })
      const text = await res.text()
      ;(document.getElementById("mbody") as HTMLTextAreaElement).value = body ? `${body}\n\n${text}` : text
    } catch (e) {
      console.error(e)
      alert("AI suggestion failed")
    } finally {
      setLoading(false)
    }
  }

  function save() {
    const title = (document.getElementById("mtitle") as HTMLInputElement).value
    const body = (document.getElementById("mbody") as HTMLTextAreaElement).value
    const when = (document.getElementById("msched") as HTMLInputElement).value
    if (!title || !body) return alert("Title and body required")
    addOne<Message>(keys.messages, {
      id: uid("msg"),
      title,
      body,
      scheduleAt: when ? new Date(when).getTime() : undefined,
      createdAt: Date.now(),
    })
    refresh()
    ;(document.getElementById("mtitle") as HTMLInputElement).value = ""
    ;(document.getElementById("mbody") as HTMLTextAreaElement).value = ""
    ;(document.getElementById("msched") as HTMLInputElement).value = ""
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-2">
        <input
          id="mtitle"
          placeholder="Announcement title"
          className="rounded-md border border-border bg-background px-3 py-2 md:col-span-1"
        />
        <input
          id="msched"
          type="datetime-local"
          className="rounded-md border border-border bg-background px-3 py-2 md:col-span-1"
        />
        <div className="flex gap-2 md:col-span-1">
          <button
            onClick={askAI}
            disabled={loading}
            className="rounded-md border border-border bg-muted px-3 py-2 text-sm hover:bg-muted/80 disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask SPHINIX AI"}
          </button>
          <button
            onClick={save}
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
      <textarea
        id="mbody"
        rows={6}
        placeholder="Write email/announcement..."
        className="w-full rounded-md border border-border bg-background px-3 py-2"
      />

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border font-semibold">Saved Messages</div>
        <div className="divide-y divide-border">
          {rows.map((m) => (
            <div key={m.id} className="p-4">
              <div className="text-sm text-muted-foreground">
                {m.scheduleAt ? `Scheduled: ${new Date(m.scheduleAt).toLocaleString()}` : "Saved draft"}
              </div>
              <div className="font-medium">{m.title}</div>
              <p className="text-sm mt-1 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))}
          {rows.length === 0 && <div className="p-4 text-sm text-muted-foreground">No messages saved</div>}
        </div>
      </div>
    </div>
  )
}
