import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const origin = url.origin
  const next = url.searchParams.get("next") || "/student"

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  // Prepare redirect response first so cookie setters attach to it
  const res = NextResponse.redirect(new URL(next, origin))

  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options })
        },
        remove: (key, options) => {
          res.cookies.set({ name: key, value: "", ...options })
        },
      },
    })

    // Exchange the OAuth "code" for a session (also works for magic links)
    await supabase.auth.exchangeCodeForSession(req.url)
  } catch (e) {
    console.warn("[auth/callback] exchangeCodeForSession failed:", (e as Error)?.message)
  }

  return res
}
