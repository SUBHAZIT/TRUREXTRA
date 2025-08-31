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
  if (!user) return NextResponse.json({ items: [] })

  const { data: solvedRows } = await supabase
    .from("submissions")
    .select("challenge_id")
    .eq("user_id", user.id)
    .eq("passed", true)
    .limit(200)

  let solvedCount = 0
  const categories: Record<string, number> = {}

  if (solvedRows && solvedRows.length) {
    solvedCount = solvedRows.length
    const ids = solvedRows.map((r) => r.challenge_id)
    const { data: challs } = await supabase.from("challenges").select("id, category").in("id", ids)
    if (challs) {
      for (const c of challs) {
        const cat = (c.category as string) || "General"
        categories[cat] = (categories[cat] || 0) + 1
      }
    }
  }

  // Simple heuristics for recommendations
  const items: { title: string; description: string; href: string }[] = []

  if (solvedCount < 5) {
    items.push({
      title: "Start with Beginner Algorithms",
      description: "Build momentum with foundational problems to boost confidence.",
      href: "/student#daily-challenge",
    })
  } else {
    // find least practiced category
    const catEntries = Object.entries(categories)
    const target = catEntries.length ? catEntries.sort((a, b) => a[1] - b[1])[0][0] : "Data Structures"
    items.push({
      title: `Focus on ${target}`,
      description: "Balance your skill profile by practicing less-covered topics.",
      href: "/student#daily-challenge",
    })
  }

  items.push({
    title: "Join a Hackathon Team",
    description: "Apply your skills in a real project and earn the 'first-hackathon-submit' badge.",
    href: "/organizer",
  })

  items.push({
    title: "Apply to 1 internship today",
    description: "Ship your profile and get interview practice through real opportunities.",
    href: "/student#jobs",
  })

  return NextResponse.json({ items })
}
