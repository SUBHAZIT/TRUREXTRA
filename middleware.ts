import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const FALLBACK_SUPABASE_URL = "https://tcdlwxlpsagywbfcedag.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZGx3eGxwc2FneXdiZmNlZGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjYwOTIsImV4cCI6MjA3MTcwMjA5Mn0.xS5Xw86XqXMqXvqiK8OLURRdgyTZRLJzh-xsq65MU7s"

const protectedPrefixes = ["/student", "/mentor", "/recruiter", "/organizer", "/investor", "/college"]
function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  const url = new URL(req.url)

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[v0] Supabase envs missing in middleware.")
    if (isProtectedPath(url.pathname)) {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    return res
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        const v = req.cookies.get(key)?.value
        if (v && key.startsWith("sb-") && v.includes("[object Object]")) {
          // treat as missing to avoid auth-js crash during recovery
          return undefined
        }
        return v
      },
      set: (key, value, options) => res.cookies.set({ name: key, value, ...options }),
      remove: (key, options) => res.cookies.set({ name: key, value: "", ...options }),
    },
  })

  // Ensure session cookies are refreshed
  let authUser: any = null
  try {
    const { data } = await supabase.auth.getUser()
    authUser = data?.user ?? null
  } catch (err) {
    console.warn("[middleware] supabase.auth.getUser() failed; clearing auth cookies")
    for (const c of req.cookies.getAll()) {
      if (c.name.startsWith("sb-")) {
        res.cookies.set({ name: c.name, value: "", path: "/", maxAge: 0 })
      }
    }
    authUser = null
  }

  // Protect dashboards and enforce onboarding completion
  if (isProtectedPath(url.pathname)) {
    if (!authUser) {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    // If the "profiles" table is missing (empty schema), do NOT block access.
    let shouldEnforceOnboarding = true
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, role, user_id")
        .or(`id.eq.${authUser.id},user_id.eq.${authUser.id}`)
        .maybeSingle()

      if (error) {
        console.warn("[middleware] profiles check failed:", error.message)
        shouldEnforceOnboarding = false
      } else if (!profile) {
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
    } catch (e: any) {
      console.warn("[middleware] profiles check exception:", e?.message)
      shouldEnforceOnboarding = false
    }

    if (!shouldEnforceOnboarding) {
      return res
    }
  }

  return res
}

export const config = {
  matcher: [
    "/student/:path*",
    "/mentor/:path*",
    "/recruiter/:path*",
    "/organizer/:path*",
    "/investor/:path*",
    "/college/:path*",
  ],
}
