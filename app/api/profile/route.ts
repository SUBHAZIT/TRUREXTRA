export const dynamic = 'error'
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

function getServerSupabaseFromCookies(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) throw new Error("SUPABASE NOT CONFIGURED")

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: (name) => cookies().get(name)?.value,
      set: () => {},
      remove: () => {},
    },
  })
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerSupabaseFromCookies(req)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: "NOT AUTHENTICATED" }, { status: 401 })

    // Try user_id shape first
    let profile = null as any
    let errMsg: string | null = null

    const { data: p1, error: e1 } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
    if (e1) {
      // If column/table missing, try legacy id shape
      const { data: p2, error: e2 } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      if (e2) {
        // If still failing, return helpful message but don't crash
        errMsg = e2.message
      } else {
        profile = p2
      }
    } else {
      profile = p1
    }

    if (errMsg) {
      // If the table/column doesn't exist, surface a clear hint
      return NextResponse.json(
        {
          ok: true,
          profile: null,
          hint: "Profiles table/columns missing. Run scripts/002_profiles.sql (user_id PK, no meta) or adjust DB to match code.",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ ok: true, profile })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabaseFromCookies(req)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: "NOT AUTHENTICATED" }, { status: 401 })

    const body = await req.json()
    const { full_name, role } = body || {}

    // First try the user_id schema (scripts/002_profiles.sql)
    const payloadV2 = {
      user_id: user.id,
      full_name: full_name ?? null,
      role: role ?? null,
    }
    const { error: up1 } = await supabase.from("profiles").upsert(payloadV2, { onConflict: "user_id" })
    if (!up1) return NextResponse.json({ ok: true })

    // If user_id is missing (42703 undefined_column) or table absent (42P01), try legacy id schema
    const payloadV1 = {
      id: user.id,
      full_name: full_name ?? null,
      role: role ?? null,
      // meta intentionally omitted to avoid column errors
    }
    const { error: up2 } = await supabase.from("profiles").upsert(payloadV1, { onConflict: "id" })
    if (!up2) return NextResponse.json({ ok: true })

    // Neither shape worked - provide a helpful error
    return NextResponse.json(
      {
        ok: false,
        error:
          up2?.message ||
          up1?.message ||
          "Failed to save profile. Please run scripts/002_profiles.sql to create the profiles table.",
      },
      { status: 500 },
    )
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
