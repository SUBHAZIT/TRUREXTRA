import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// These are public anon fallbacks; use only if env vars are missing (e.g., in preview).
const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

export function getServerSupabase() {
  const cookieStore = cookies()

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  // Helper: hide corrupted cookies from auth-js
  const safeGet = (name: string) => {
    const raw = cookieStore.get(name)?.value
    if (!raw) return undefined
    if (name.startsWith("sb-") && raw.includes("[object Object]")) {
      // don't surface bad values; auth-js will treat as signed-out and not crash
      return undefined
    }
    return raw
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: safeGet,
      // In RSC, mutation isn't allowed; provide no-ops to avoid throwing
      set: () => {
        /* no-op in RSC */
      },
      remove: () => {
        /* no-op in RSC */
      },
    },
  })

  return supabase
}
