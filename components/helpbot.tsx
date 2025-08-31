"use client"
import * as React from "react"

export default function Helpbot() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<{ role: "USER" | "ASSISTANT"; content: string }[]>([])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const userMsg = { role: "USER" as const, content: input }
    setMessages((m) => [...m, userMsg])
    setInput("")
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    })
    const data = await res.json()
    setMessages((m) => [...m, { role: "ASSISTANT", content: data.text }])
  }

  return (
    <>
      <button
        aria-label="OPEN AI HELPBOT"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg"
        onClick={() => setOpen((o) => !o)}
      >
        AI HELPBOT
      </button>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 rounded-lg border bg-background p-3 shadow-xl">
          <div className="mb-2 text-sm font-semibold">TRUREXTRA AI HELPBOT</div>
          <div className="mb-2 h-48 overflow-auto rounded border p-2 text-xs">
            {messages.length === 0 ? <p className="opacity-60">ASK ANYTHING ABOUT YOUR DASHBOARD.</p> : null}
            {messages.map((m, i) => (
              <div key={i} className="mb-2">
                <div className="opacity-60">{m.role}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded border px-2 py-1 text-xs"
              placeholder="TYPE YOUR QUESTION"
            />
            <button className="rounded bg-primary px-2 text-xs text-primary-foreground">SEND</button>
          </form>
        </div>
      )}
    </>
  )
}
