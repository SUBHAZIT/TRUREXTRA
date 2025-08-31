export const dynamic = 'error'

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tcdlwxlpsagywbfcedag.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )
}

export async function GET(req: Request) {
  const supabase = await getSupabase()
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("mode")
  if (mode === "daily") {
    // pick a deterministic challenge by day
    const dayIndex = Math.floor(Date.now() / 86400000)
    const { data, error } = await supabase.from("challenges").select("*").order("created_at").limit(50)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const chosen = data && data.length ? data[dayIndex % data.length] : null
    return NextResponse.json({ data: chosen })
  }
  const { data, error } = await supabase.from("challenges").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
