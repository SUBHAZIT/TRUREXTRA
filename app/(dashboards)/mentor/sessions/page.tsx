import NewSessionForm from "../ui/new-session-form"
import { getServerSupabase } from "@/lib/supabase/server"

async function getData() {
  const supabase = getServerSupabase()
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { sessions: [], error: "unauthorized" }
    const { data, error } = await supabase
      .from("mentor_sessions")
      .select("*")
      .eq("mentor_id", userData.user.id)
      .order("scheduled_at", { ascending: true })
      .order("created_at", { ascending: false })
    if (error) return { sessions: [], error: error.message }
    return { sessions: data ?? [], error: null }
  } catch (e: any) {
    return { sessions: [], error: e?.message || "Failed" }
  }
}

export default async function MentorSessionsPage() {
  const { sessions, error } = await getData()
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">My Sessions</h1>
      <NewSessionForm />
      {error ? (
        <p className="text-yellow-300 text-sm">
          {error.includes("relation") ? "Please run scripts/005_mentorship.sql to create tables." : error}
        </p>
      ) : null}
      <ul className="space-y-3">
        {sessions.map((s: any) => (
          <li key={s.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
            <div className="font-semibold">{s.title}</div>
            {s.description ? <div className="text-sm text-white/70">{s.description}</div> : null}
            {s.scheduled_at ? (
              <div className="text-xs text-white/60 mt-1">Scheduled: {new Date(s.scheduled_at).toLocaleString()}</div>
            ) : null}
            <div className="text-xs text-white/60 mt-1">Created: {new Date(s.created_at).toLocaleString()}</div>
          </li>
        ))}
        {!sessions.length ? <li className="text-white/70">No sessions yet.</li> : null}
      </ul>
    </main>
  )
}
