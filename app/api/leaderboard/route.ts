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

  // Top 10
  const { data: top, error: topErr } = await supabase
    .from("leaderboard")
    .select("user_id, solved_count")
    .order("solved_count", { ascending: false })
    .limit(10)
  if (topErr) return NextResponse.json({ error: topErr.message }, { status: 500 })

  // Try to fetch names from profiles; if not available, fallback to short user ids
  const names: Record<string, string> = {}
  if (top.length) {
    const ids = top.map((t) => t.user_id)
    const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids)
    if (profs) {
      for (const p of profs) names[p.id as string] = (p.full_name as string) || ""
    }
  }
  const topWithNames = top.map((t, i) => ({
    rank: i + 1,
    user_id: t.user_id,
    name: names[t.user_id] || `${t.user_id.slice(0, 4)}…${t.user_id.slice(-4)}`,
    solved_count: t.solved_count,
  }))

  // Current user rank
  let me: { solved_count: number; rank: number } | null = null
  if (user) {
    const { data: meRow } = await supabase.from("leaderboard").select("solved_count").eq("user_id", user.id).single()
    if (meRow) {
      const { count } = await supabase
        .from("leaderboard")
        .select("user_id", { count: "exact", head: true })
        .gt("solved_count", meRow.solved_count)
      me = { solved_count: meRow.solved_count, rank: ((count as number) || 0) + 1 }
    }
  }

  return NextResponse.json({ top: topWithNames, me })
}
