import { getServerSupabase } from "@/lib/supabase/server"

async function getData() {
  const supabase = getServerSupabase()
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { requests: [], error: "unauthorized" }
    const { data, error } = await supabase.from("mentor_requests").select("*").order("created_at", { ascending: false })
    if (error) return { requests: [], error: error.message }
    return { requests: data ?? [], error: null }
  } catch (e: any) {
    return { requests: [], error: e?.message || "Failed" }
  }
}

export default async function MentorRequestsPage() {
  const { requests, error } = await getData()
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">Mentorship Requests</h1>
      {error ? (
        <p className="text-yellow-300 text-sm">
          {error.includes("relation") ? "Please run scripts/005_mentorship.sql to create tables." : error}
        </p>
      ) : null}
      <ul className="space-y-3">
        {requests.map((r: any) => (
          <li key={r.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
            <div className="font-semibold">Status: {r.status}</div>
            <div className="text-sm text-white/70 mt-1">To mentor: {r.mentor_id}</div>
            <div className="text-sm text-white/70">From student: {r.student_id}</div>
            {r.message ? <div className="text-sm text-white/80 mt-1">{r.message}</div> : null}
            <div className="text-xs text-white/60 mt-1">Created: {new Date(r.created_at).toLocaleString()}</div>
          </li>
        ))}
        {!requests.length ? <li className="text-white/70">No requests yet.</li> : null}
      </ul>
    </main>
  )
}
