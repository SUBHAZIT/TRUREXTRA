import NewStartupForm from "../ui/new-startup-form"
import { getServerSupabase } from "@/lib/supabase/server"

async function getData() {
  const supabase = getServerSupabase()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return { mine: [], recent: [], error: "unauthorized" }
  try {
    const mine = await supabase
      .from("startups")
      .select("*")
      .eq("created_by", userData.user.id)
      .order("created_at", { ascending: false })
    const recent = await supabase.from("startups").select("*").order("created_at", { ascending: false }).limit(10)
    return {
      mine: mine.data ?? [],
      recent: recent.data ?? [],
      error: mine.error?.message || recent.error?.message || null,
    }
  } catch (e: any) {
    return { mine: [], recent: [], error: e?.message || "Failed" }
  }
}

export default async function InvestorStartupsPage() {
  const { mine, recent, error } = await getData()
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">My Startups</h1>
      <NewStartupForm />
      {error ? (
        <p className="text-yellow-300 text-sm">
          {error.includes("relation") ? "Please run scripts/006_investor.sql" : error}
        </p>
      ) : null}
      <section>
        <h2 className="font-semibold mb-2 uppercase">My List</h2>
        <ul className="space-y-2">
          {mine.map((s: any) => (
            <li key={s.id} className="border border-white/10 rounded-lg p-3 bg-white/5">
              <div className="font-semibold">
                {s.name} {s.stage ? <span className="text-xs opacity-70">({s.stage})</span> : null}
              </div>
              {s.description ? <div className="text-sm opacity-80">{s.description}</div> : null}
            </li>
          ))}
          {!mine.length ? <li className="opacity-70">No startups yet.</li> : null}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mt-6 mb-2 uppercase">Recent</h2>
        <ul className="space-y-2">
          {recent.map((s: any) => (
            <li key={s.id} className="border border-white/10 rounded-lg p-3 bg-white/5">
              <div className="font-semibold">{s.name}</div>
              {s.description ? <div className="text-sm opacity-80">{s.description}</div> : null}
            </li>
          ))}
          {!recent.length ? <li className="opacity-70">No startups found.</li> : null}
        </ul>
      </section>
    </main>
  )
}
