import Link from "next/link"
import { getServerSupabase } from "../../../lib/supabase/server"

export default async function MentorDashboard() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: communities }, { data: meetings }] = await Promise.all([
    supabase
      .from("communities")
      .select("id, name, description")
      .eq("owner_id", user?.id ?? ""),
    supabase
      .from("meetings")
      .select("id, scheduled_at, status, student_id")
      .eq("mentor_id", user?.id ?? "")
      .order("scheduled_at", { ascending: true }),
  ])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{"MENTOR DASHBOARD".toUpperCase()}</h1>
      <p className="text-muted-foreground">
        {"CREATE COMMUNITIES • SCHEDULE MEETINGS • ENGAGE STUDENTS".toUpperCase()}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"YOUR COMMUNITIES".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(communities ?? []).map((c: any) => (
              <li key={c.id}>{(c.name || "UNTITLED").toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"CREATE NEW COMMUNITY".toUpperCase()}
          </Link>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"UPCOMING MEETINGS".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(meetings ?? []).map((m: any) => (
              <li key={m.id}>{`MEETING #${m.id} • ${m.status} • ${m.scheduled_at}`.toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"SCHEDULE MEETING".toUpperCase()}
          </Link>
        </div>
      </div>
    </section>
  )
}
