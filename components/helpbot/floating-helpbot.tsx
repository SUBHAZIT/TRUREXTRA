"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

// Utility component to render code blocks with copy button
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore copy errors
    }
  }

  return (
    <div className="relative my-2 rounded bg-gray-800 p-2 text-sm text-white">
      <pre ref={codeRef} className="overflow-x-auto whitespace-pre-wrap">{code}</pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-1 right-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}

// Utility to parse message text into parts: code blocks and normal text
function parseMessageText(text: string): (string | { code: string })[] {
  const parts: (string | { code: string })[] = []
  const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    parts.push({ code: match[2] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  return parts
}

// Utility to render markdown-like inline formatting for * and ** (bold and italic)
function renderFormattedText(text: string) {
  // Simple replacements for *italic* and **bold**
  // This is a basic implementation and can be improved with a markdown parser if needed
  const boldItalicRegex = /(\*\*\*|___)(.*?)\1/g
  const boldRegex = /(\*\*|__)(.*?)\1/g
  const italicRegex = /(\*|_)(.*?)\1/g

  let formatted = text
    .replace(boldItalicRegex, (_, __, content) => `<strong><em>${content}</em></strong>`)
    .replace(boldRegex, (_, __, content) => `<strong>${content}</strong>`)
    .replace(italicRegex, (_, __, content) => `<em>${content}</em>`)

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />
}

export default function FloatingHelpbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "USER" | "ASSISTANT"; text: string }[]>([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { role: "USER", text }])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/sphinix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
      })
      if (!res.ok) {
        const t = await res.text()
        setMessages((m) => [...m, { role: "ASSISTANT", text: `Error: ${t}` }])
      } else {
        const data = await res.json()
        setMessages((m) => [...m, { role: "ASSISTANT", text: String(data.text || "") }])
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "ASSISTANT", text: `Error: ${String(err?.message || err)}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center">
        <button
          aria-label={open ? "Close SPHINIX AI" : "Open SPHINIX AI"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 transition-colors"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4V5.5C14 6.3 14.3 7 14.8 7.5C15.3 8 16 8.3 16.5 8.3H18C19.1 8.3 20 9.2 20 10.3V12C20 13.1 19.1 14 18 14H16.5C15.7 14 15 14.3 14.5 14.8C14 15.3 13.7 16 13.7 16.5V18C13.7 19.1 12.8 20 11.7 20H10.3C9.2 20 8.3 19.1 8.3 18V16.5C8.3 15.7 8 15 7.5 14.5C7 14 6.3 13.7 5.5 13.7H4C2.9 13.7 2 12.8 2 11.7V10.3C2 9.2 2.9 8.3 4 8.3H5.5C6.3 8.3 7 8 7.5 7.5C8 7 8.3 6.3 8.3 5.5V4C8.3 2.9 9.2 2 10.3 2H12Z" fill="currentColor" stroke="white" strokeWidth="1"/>
          </svg>
        </button>
        {!open && (
          <div className="mt-2 text-center text-xs font-bold text-white bg-black/50 px-2 py-1 rounded shadow-lg" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}>
            SPHINIX AI - YOUR AI POWERED MENTOR
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed bottom-20 right-4 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/20 bg-gray-900/95 text-white backdrop-blur-lg shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="font-bold">SPHINIX AI — YOUR AI POWERED MENTOR</div>
            <button className="text-white/70 hover:text-white" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "USER" ? "text-right" : "text-left"}>
                {parseMessageText(m.text).map((part, idx) =>
                  typeof part === "string" ? (
                    <div key={idx} className={m.role === "USER" ? "inline-block rounded bg-blue-600 px-3 py-2 text-sm text-white" : "inline-block rounded bg-white/10 px-3 py-2 text-sm text-white"}>
                      {renderFormattedText(part)}
                    </div>
                  ) : (
                    <CodeBlock key={idx} code={part.code} />
                  )
                )}
              </div>
            ))}
            {loading ? <div className="text-center text-xs opacity-70">Thinking…</div> : null}
            <div ref={endRef} />
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
            <input
              className="flex-1 rounded-md bg-white/10 px-3 py-2 text-white placeholder:text-white/50"
              placeholder="Ask SPHINIX AI…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  )
}
