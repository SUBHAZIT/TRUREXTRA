export const dynamic = 'error'
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

function getServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY
  return createServerClient(url, key, {
    cookies: {
      get: (name) => cookies().get(name)?.value,
      set: () => {},
      remove: () => {},
    },
  })
}

export async function GET(req: NextRequest) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = new URL(req.url)
  const mine = url.searchParams.get("mine") === "1"

  let query = supabase
    .from("events")
    .select("id,title,venue,start_at,created_at,checkins(count)")
    .order("created_at", { ascending: false }) as any
  if (mine && user?.id) query = query.eq("owner_id", user.id)

  const { data, error } = await query
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, events: data })
}

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: "NOT AUTHENTICATED" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { title, description, venue, start_at } = body || {}
  if (!title) return NextResponse.json({ ok: false, error: "TITLE REQUIRED" }, { status: 400 })

  const { error } = await supabase.from("events").insert({
    owner_id: user.id,
    title,
    description: description ?? null,
    venue: venue ?? null,
    start_at: start_at ?? null,
  })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
