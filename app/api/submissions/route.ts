export const dynamic = 'error'
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tcdlwxlpsagywbfcedag.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s",
    { cookies: { get: cookieStore.get, set: cookieStore.set, remove: cookieStore.delete } },
  )
}

export async function GET() {
  const supabase = getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // simple stats
  const { data: solved, error } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("passed", true)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ stats: { solved: solved ? solved.length : 0 } })
}

export async function POST(req: Request) {
  const { challenge_id, code, passed, score } = await req.json()
  const supabase = getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { error } = await supabase.from("submissions").insert({
    challenge_id,
    user_id: user.id,
    language: "javascript",
    code,
    passed,
    score,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Award "first-solve" badge if this is the user's first passed submission
  if (passed) {
    const { data: solvedBefore } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .limit(2)
    if ((solvedBefore?.length || 0) <= 1) {
      const { data: badge } = await supabase.from("badges").select("id").eq("slug", "first-solve").single()
      if (badge?.id) {
        await supabase
          .from("user_badges")
          .insert({ user_id: user.id, badge_id: badge.id })
          .catch(() => {})
      }
    }
  }

  return NextResponse.json({ ok: true })
}
