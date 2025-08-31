import { getServerSupabase } from "@/lib/supabase/server"

export default async function CollegeDashboardPage() {
  const supabase = getServerSupabase()
  const { data: userData } = await supabase.auth.getUser()

  let programsCount = 0
  let studentsCount = 0
  let warning: string | null = null

  if (userData?.user) {
    try {
      const { count, error } = await supabase
        .from("college_programs")
        .select("*", { count: "exact", head: true })
        .eq("college_id", userData.user.id)
      if (!error && typeof count === "number") programsCount = count ?? 0
    } catch (e: any) {
      warning = "Please run scripts/007_college.sql to create college tables."
    }

    try {
      const { count, error } = await supabase
        .from("college_students")
        .select("*", { count: "exact", head: true })
        .eq("college_id", userData.user.id)
      if (!error && typeof count === "number") studentsCount = count ?? 0
    } catch (e: any) {
      warning = "Please run scripts/007_college.sql to create college tables."
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold uppercase">ACADEMIC / COLLEGE DASHBOARD</h1>
      {warning ? <p className="text-yellow-300 text-sm">{warning}</p> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-lg font-semibold uppercase">Programs</h2>
          <p className="text-sm opacity-80">Create and manage academic programs.</p>
          <div className="mt-3 flex items-center justify-between">
            <a className="mt-3 inline-block rounded border px-3 py-2" href="/college/programs">
              MANAGE PROGRAMS
            </a>
            <span className="text-xs opacity-70">TOTAL: {programsCount}</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-2 text-lg font-semibold uppercase">Students</h2>
          <p className="text-sm opacity-80">Map students to your college/programs.</p>
          <div className="mt-3 flex items-center justify-between">
            <a className="mt-3 inline-block rounded border px-3 py-2" href="/college/students">
              MANAGE STUDENTS
            </a>
            <span className="text-xs opacity-70">TOTAL: {studentsCount}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
