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

export async function POST(req: Request) {
  const { team_id, repo_url, demo_url, description } = await req.json()
  const supabase = getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { error } = await supabase.from("hackathon_submissions").insert({ team_id, repo_url, demo_url, description })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Award "first-hackathon-submit" badge
  const { data: badge } = await supabase.from("badges").select("id").eq("slug", "first-hackathon-submit").single()
  if (badge?.id)
    await supabase
      .from("user_badges")
      .insert({ user_id: user.id, badge_id: badge.id })
      .catch(() => {})

  return NextResponse.json({ ok: true })
}
