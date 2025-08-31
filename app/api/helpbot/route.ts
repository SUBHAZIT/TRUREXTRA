export const dynamic = 'error'
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const prompt: string | undefined = typeof body?.prompt === "string" ? body.prompt : undefined
    const messages = Array.isArray(body?.messages) ? body.messages : null

    if (!prompt && !messages) {
      return new NextResponse("Invalid request: provide prompt or messages[]", { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // server-only key required
      return new NextResponse("AI key missing. Set OPENAI_API_KEY.", { status: 500 })
    }

    const system =
      "You are SPHINIX AI, a concise, friendly study assistant for the student dashboard. Be helpful and safe."

    const composedPrompt =
      prompt ??
      (messages as { role: string; content: string }[])
        .map((m) => `${m.role?.toUpperCase?.() || "USER"}: ${m.content ?? ""}`)
        .join("\n")

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system,
      prompt: composedPrompt,
    })

    return NextResponse.json({ text })
  } catch (err: any) {
    return new NextResponse(err?.message || "SPHINIX AI error", { status: 500 })
  }
}
