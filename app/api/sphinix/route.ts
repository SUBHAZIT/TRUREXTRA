export const dynamic = 'error'
// Reads key from env var GOOGLE_GENERATIVE_AI_API_KEY (server-only).
import type { NextRequest } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: { role: "user" | "assistant" | "system"; content: string }[] = Array.isArray(body?.messages)
      ? body.messages
      : []

    // Compose a simple prompt from messages. You could use structured chat in AI SDK when needed.
    const history = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")

    const { text } = await generateText({
      // Pick a fast Gemini model; adjust if you prefer 1.5-pro
      model: google("gemini-1.5-flash"),
      // Optional system directive:
      system:
        "You are Sphinix, a concise, helpful assistant for a student dashboard. Provide accurate, friendly answers.",
      prompt: history + "\nASSISTANT:",
    })

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err: any) {
    console.error("[v0] /api/sphinix error:", err?.message)
    return new Response(JSON.stringify({ error: "Sphinix failed to respond." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
