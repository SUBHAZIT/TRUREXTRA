import type React from "react"
import Link from "next/link"
import { getServerSupabase } from "../../lib/supabase/server"

import Helpbot from "./HelpbotClient"

export default async function DashboardsLayout({ children }: { children: React.ReactNode }) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user?.id ?? "")
    .single()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-bold tracking-wide">
            {("TRUREXTRA " + (profile?.role || "USER") + " DASHBOARD").toUpperCase()}
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="hover:underline" href="/dashboards/integrations">
              {"INTEGRATIONS".toUpperCase()}
            </Link>
            <Link className="hover:underline" href="/dashboards">
              {"HOME".toUpperCase()}
            </Link>
            <Link className="hover:underline" href="/">
              {"BACK TO SITE".toUpperCase()}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Helpbot />
    </div>
  )
}
