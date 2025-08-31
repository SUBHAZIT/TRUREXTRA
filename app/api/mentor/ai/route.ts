export const dynamic = 'error'
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { action, mentee, goal } = await req.json()
    const model = openai("gpt-4o-mini")

    let prompt = ""
    if (action === "summarize") {
      prompt = `You are an AI mentor assistant. Summarize this mentee and propose next steps succinctly.\nMentee JSON:\n${JSON.stringify(
        mentee,
      )}`
    } else if (action === "plan") {
      prompt = `You are an AI mentor assistant. Create a practical, step-by-step learning plan for this goal, with weekly milestones and 3 resources per week. Keep it compact.\nGoal: ${goal}`
    } else {
      prompt = "Say OK."
    }

    const { text } = await generateText({
      model,
      system: "Be concise, actionable, and mentor-oriented.",
      prompt,
    })

    return NextResponse.json({ ok: true, text })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "AI error" }, { status: 500 })
  }
}
