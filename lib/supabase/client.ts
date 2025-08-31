"use client"
import { createBrowserClient } from "@supabase/ssr"

function sanitizeSupabaseStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return
    const keysToRemove: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (!k || !k.startsWith("sb-")) continue
      const v = window.localStorage.getItem(k)
      if (!v) continue
      if (v.includes("[object Object]")) {
        keysToRemove.push(k)
        continue
      }
      try {
        const parsed = JSON.parse(v)
        const isObj = parsed !== null && typeof parsed === "object"
        if (!isObj) keysToRemove.push(k)
      } catch {
        keysToRemove.push(k)
      }
    }
    for (const k of keysToRemove) window.localStorage.removeItem(k)
    if (keysToRemove.length > 0) {
      console.warn("[Supabase] Cleared corrupted auth entries (early):", keysToRemove)
    }
  } catch {
    // ignore storage access issues
  }
}
sanitizeSupabaseStorage()

let client: ReturnType<typeof createBrowserClient> | null = null

// Fallbacks are safe for the browser because this is the public anon key.
// Prefer setting env vars in Project Settings; these are used only if missing.
const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

export function getSupabaseClient() {
  if (!client) {
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const url = envUrl || FALLBACK_SUPABASE_URL
    const key = envKey || FALLBACK_SUPABASE_ANON_KEY

    if (!envUrl || !envKey) {
      console.warn(
        "[Supabase] Using inline fallback NEXT_PUBLIC keys. For production, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Project Settings.",
      )
    }

    client = createBrowserClient(url, key)
  }
  return client
}
