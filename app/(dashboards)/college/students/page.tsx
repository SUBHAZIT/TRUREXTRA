import AddStudentForm from "../ui/add-student-form"
import { getServerSupabase } from "@/lib/supabase/server"

async function getStudents() {
  const supabase = getServerSupabase()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return { rows: [], error: "unauthorized" }
  try {
    const { data, error } = await supabase
      .from("college_students")
      .select("*")
      .eq("college_id", userData.user.id)
      .order("created_at", { ascending: false })
    return { rows: data ?? [], error: error?.message || null }
  } catch (e: any) {
    return { rows: [], error: e?.message || "Failed" }
  }
}

export default async function CollegeStudentsPage() {
  const { rows, error } = await getStudents()
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold uppercase">Students</h1>
      <AddStudentForm />
      {error ? (
        <p className="text-yellow-300 text-sm">
          {error.includes("relation") ? "Please run scripts/007_college.sql" : error}
        </p>
      ) : null}
      <ul className="space-y-2">
        {rows.map((r: any) => (
          <li key={r.id} className="border border-white/10 rounded-lg p-3 bg-white/5">
            <div className="font-semibold">Student: {r.student_id}</div>
            {r.program_id ? <div className="text-sm opacity-80">Program: {r.program_id}</div> : null}
            <div className="text-xs opacity-70">Added: {new Date(r.created_at).toLocaleString()}</div>
          </li>
        ))}
        {!rows.length ? <li className="opacity-70">No students mapped yet.</li> : null}
      </ul>
    </main>
  )
}
