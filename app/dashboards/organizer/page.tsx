import Link from "next/link"
import { getServerSupabase } from "../../../lib/supabase/server"

export default async function OrganizerDashboard() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from("events")
    .select("id, title, starts_at, is_published")
    .eq("organizer_id", user?.id ?? "")
    .order("starts_at", { ascending: true })

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{"ORGANIZER DASHBOARD".toUpperCase()}</h1>
      <p className="text-muted-foreground">
        {"HOST HACKATHONS • FIND MENTORS/JUDGES • MANAGE QR CHECK-INS".toUpperCase()}
      </p>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-2">{"YOUR EVENTS".toUpperCase()}</h2>
        <ul className="list-disc pl-5 text-sm">
          {(events ?? []).map((e: any) => (
            <li key={e.id}>
              {`${e.title} • ${e.is_published ? "PUBLISHED" : "DRAFT"} • ${e.starts_at}`.toUpperCase()}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex gap-3">
          <Link className="underline text-blue-600" href="#">
            {"CREATE EVENT".toUpperCase()}
          </Link>
          <Link className="underline text-blue-600" href="#">
            {"OPEN QR SCANNER".toUpperCase()}
          </Link>
        </div>
      </div>
    </section>
  )
}
