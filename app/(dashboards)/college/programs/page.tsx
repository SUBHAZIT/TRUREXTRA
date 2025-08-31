import NewProgramForm from "../ui/new-program-form"
import { getServerSupabase } from "@/lib/supabase/server"

async function getPrograms() {
  const supabase = getServerSupabase()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return { programs: [], error: "unauthorized" }
  try {
    const { data, error } = await supabase
      .from("college_programs")
      .select("*")
      .eq("college_id", userData.user.id)
      .order("created_at", { ascending: false })
    return { programs: data ?? [], error: error?.message || null }
  } catch (e: any) {
    return { programs: [], error: e?.message || "Failed" }
  }
}

export default async function CollegeProgramsPage() {
  const { programs, error } = await getPrograms()
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">Programs</h1>
      <NewProgramForm />
      {error ? (
        <p className="text-yellow-300 text-sm">
          {error.includes("relation") ? "Please run scripts/007_college.sql" : error}
        </p>
      ) : null}
      <ul className="space-y-2">
        {programs.map((p: any) => (
          <li key={p.id} className="border border-white/10 rounded-lg p-3 bg-white/5">
            <div className="font-semibold">{p.name}</div>
            {p.description ? <div className="text-sm opacity-80">{p.description}</div> : null}
          </li>
        ))}
        {!programs.length ? <li className="opacity-70">No programs yet.</li> : null}
      </ul>
    </main>
  )
}
