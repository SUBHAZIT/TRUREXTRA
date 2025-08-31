export const dynamic = 'error'
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Input: { jobDescription: string, candidates: string[] } where each candidate string is a pasted resume.
// Output: ranked candidates with reasons. Works without DB dependencies.
export async function POST(req: Request) {
  try {
    const { jobDescription, candidates } = (await req.json().catch(() => ({}))) as {
      jobDescription?: string
      candidates?: string[]
    }

    if (!jobDescription || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: "jobDescription and candidates[] are required" }, { status: 400 })
    }

    // Build a compact prompt. Keep deterministic, concise output (JSON).
    const prompt = `
You are an expert technical recruiter. Rank resumes by fit to this job and explain briefly.

JOB:
${jobDescription.trim()}

CANDIDATES:
${candidates.map((c, i) => `---\nCandidate ${i + 1}:\n${c.trim()}`).join("\n")}

Return JSON with shape:
{
  "rankings": [
    { "index": <number starting at 1>, "score": <0-100>, "reason": "<1-2 sentences>" }
  ]
}
Only output JSON, nothing else.
`.trim()

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    // Try to parse JSON. If fail, wrap as message.
    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json(
        {
          data: null,
          raw: text,
          error: "AI returned non-JSON output; showing raw response",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ data: parsed }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to rank candidates" }, { status: 500 })
  }
}
