export const dynamic = 'error'
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { pitch, criteria } = (await req.json().catch(() => ({}))) as {
      pitch?: string
      criteria?: string
    }

    if (!pitch) {
      return NextResponse.json({ error: "pitch is required" }, { status: 400 })
    }

    const prompt = `
You are an expert VC analyst. Score the startup pitch against common investment criteria and provide concise advice.

PITCH:
${pitch.trim()}

CRITERIA (optional):
${(criteria || "Team, Market, Product, Traction, Moat, Financials, Risks").trim()}

Return ONLY JSON:
{
  "scores": { "Team": number, "Market": number, "Product": number, "Traction": number, "Moat": number, "Financials": number, "Risks": number },
  "overall": number,
  "summary": "<2-3 sentence summary>",
  "nextSteps": ["<short action 1>", "<short action 2>", "<short action 3>"]
}
`.trim()

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    try {
      const parsed = JSON.parse(text)
      return NextResponse.json({ data: parsed }, { status: 200 })
    } catch {
      return NextResponse.json(
        {
          data: null,
          raw: text,
          error: "AI returned non-JSON; showing raw result",
        },
        { status: 200 },
      )
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to evaluate pitch" }, { status: 500 })
  }
}
