import Link from "next/link"
import { getServerSupabase } from "../../../lib/supabase/server"

export default async function StudentDashboard() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role")
      .eq("user_id", user?.id ?? "")
      .single(),
    supabase
      .from("user_skills")
      .select("level, skills(name, slug)")
      .eq("user_id", user?.id ?? ""),
  ])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{"STUDENT DASHBOARD".toUpperCase()}</h1>
      <p className="text-muted-foreground">
        {"UNIFIED ACCESS TO LEETCODE • UNSTOP • LINKEDIN • SKILLS • MCQ ASSESSMENTS".toUpperCase()}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"YOUR SKILLS".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(skills ?? []).map((s: any, i: number) => (
              <li key={i}>{`${s.skills?.name || "UNKNOWN"} • LEVEL ${s.level}`.toUpperCase()}</li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Link className="underline text-blue-600" href="#">
              {"ADD NEW SKILL (VIA MCQ)".toUpperCase()}
            </Link>
            <Link className="underline text-blue-600" href="#">
              {"VIEW ATTEMPTS".toUpperCase()}
            </Link>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"INTEGRATIONS".toUpperCase()}</h2>
          <ul className="text-sm space-y-1">
            <li>{"LEETCODE: CONNECT ACCOUNT".toUpperCase()}</li>
            <li>{"UNSTOP: IMPORT EVENTS".toUpperCase()}</li>
            <li>{"LINKEDIN: SYNC PROFILE".toUpperCase()}</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
