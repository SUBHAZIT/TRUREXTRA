import { getServerSupabase } from "@/lib/supabase/server"

export default async function StudentConnectionsPage() {
  const supabase = getServerSupabase()
  await supabase.auth.getUser()
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">MANAGE CONNECTIONS</h1>
      <p className="text-sm opacity-80">
        CONNECT LEETCODE, UNSTOP, AND LINKEDIN ACCOUNTS. ADMIN SHOULD CONFIGURE OAUTH KEYS.
      </p>
      <div className="flex gap-2">
        <a className="rounded border px-3 py-2" href="/api/oauth/leetcode">
          CONNECT LEETCODE
        </a>
        <a className="rounded border px-3 py-2" href="/api/oauth/unstop">
          CONNECT UNSTOP
        </a>
        <a className="rounded border px-3 py-2" href="/api/oauth/linkedin">
          CONNECT LINKEDIN
        </a>
      </div>
    </section>
  )
}
