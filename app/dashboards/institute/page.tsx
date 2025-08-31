import Link from "next/link"
import { getServerSupabase } from "../../../lib/supabase/server"

export default async function InstituteDashboard() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: institutes }, { data: events }] = await Promise.all([
    supabase
      .from("institutes")
      .select("id, name, domain")
      .eq("admin_id", user?.id ?? ""),
    supabase.from("events").select("id, title, starts_at, is_published").order("starts_at", { ascending: true }),
  ])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{"ACADEMIC/COLLEGE DASHBOARD".toUpperCase()}</h1>
      <p className="text-muted-foreground">{"MANAGE CAMPUS EVENTS • QR CHECK-INS • BUILD COMMUNITY".toUpperCase()}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"YOUR INSTITUTES".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(institutes ?? []).map((i: any) => (
              <li key={i.id}>{`${i.name} • ${i.domain || "N/A"}`.toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"ADD INSTITUTE".toUpperCase()}
          </Link>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"CAMPUS EVENTS".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(events ?? []).map((e: any) => (
              <li key={e.id}>{`${e.title} • ${e.starts_at}`.toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"CREATE EVENT".toUpperCase()}
          </Link>
        </div>
      </div>
    </section>
  )
}
