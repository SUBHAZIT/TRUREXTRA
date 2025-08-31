import { getServerSupabase } from "@/lib/supabase/server"
import NewEventForm from "../ui/new-event-form"
import Link from "next/link"

async function getEvents(supabase: ReturnType<typeof getServerSupabase>, mine: boolean) {
  // Select with check-ins count using Supabase nested selects
  let query = supabase
    .from("events")
    .select("id,title,venue,start_at,created_at,checkins(count)")
    .order("created_at", { ascending: false }) as any

  if (mine) {
    const { data: u } = await supabase.auth.getUser()
    if (u?.user?.id) {
      query = query.eq("owner_id", u.user.id)
    }
  }
  const { data, error } = await query
  if (error) {
    // Fail soft to avoid blocking page; show empty lists and a warning
    return { events: [], warning: error.message as string }
  }
  return { events: data ?? [], warning: null as string | null }
}

export default async function OrganizerEventsPage() {
  const supabase = getServerSupabase()
  const my = await getEvents(supabase, true)
  const all = await getEvents(supabase, false)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Manage Events & Hackathons</h1>

      {my.warning || all.warning ? (
        <p className="text-yellow-600 text-sm">
          {(my.warning || all.warning) ??
            "Some data could not be loaded. Ensure event tables/policies exist (scripts/004_events.sql or 006_events_and_qr.sql)."}
        </p>
      ) : null}

      <NewEventForm
        onCreated={async () => {
          /* no-op, page is RSC and will refetch on navigation */
        }}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">My Events</h2>
        <div className="grid gap-3">
          {my.events.length === 0 ? (
            <p className="text-sm opacity-80">No events yet. Create one above.</p>
          ) : (
            my.events.map((e: any) => (
              <div key={e.id} className="rounded-lg border p-4 bg-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm opacity-80">
                      {e.venue ? `Venue: ${e.venue}` : "Venue: N/A"} •{" "}
                      {e.start_at ? new Date(e.start_at).toLocaleString() : "Start: TBD"}
                    </p>
                  </div>
                  <div className="text-sm opacity-80">
                    Check-ins: {Array.isArray(e.checkins) && e.checkins[0]?.count ? e.checkins[0].count : 0}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Link className="inline-block rounded border px-3 py-2" href={`/organizer/events/${e.id}/qr`}>
                    Check-in QR
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All Events</h2>
        <div className="grid gap-3">
          {all.events.length === 0 ? (
            <p className="text-sm opacity-80">No events found.</p>
          ) : (
            all.events.map((e: any) => (
              <div key={e.id} className="rounded-lg border p-4 bg-card">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{e.title}</h3>
                    <p className="text-sm opacity-80">
                      {e.venue ? `Venue: ${e.venue}` : "Venue: N/A"} •{" "}
                      {e.start_at ? new Date(e.start_at).toLocaleString() : "Start: TBD"}
                    </p>
                  </div>
                  <div className="text-sm opacity-80">
                    Check-ins: {Array.isArray(e.checkins) && e.checkins[0]?.count ? e.checkins[0].count : 0}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Link className="inline-block rounded border px-3 py-2" href={`/organizer/events/${e.id}/qr`}>
                    Open QR
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
