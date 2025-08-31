export const dynamic = 'error'
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const prompt = messages?.map((m: any) => `${m.role}: ${m.content}`).join("\n") ?? "ASSIST"

  // Prefer GROQ if configured, else fallback to OpenAI
  const useGroq = !!process.env.GROQ_API_KEY
  const model = useGroq ? groq("llama-3.1-70b-versatile") : openai("gpt-4o")

  const { text } = await generateText({
    model,
    system: "YOU ARE A HELPFUL ASSISTANT FOR TRUREXTRA DASHBOARDS. ANSWER CONCISELY.",
    prompt,
  })

  return NextResponse.json({ text })
}
