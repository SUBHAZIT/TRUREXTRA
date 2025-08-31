import Link from "next/link"
import { getServerSupabase } from "../../../lib/supabase/server"

export default async function InvestorDashboard() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: startups }, { data: interests }] = await Promise.all([
    supabase
      .from("startups")
      .select("id, name, stage")
      .eq("owner_id", user?.id ?? ""),
    supabase
      .from("investment_interests")
      .select("id, startup_id, amount, status")
      .eq("investor_id", user?.id ?? ""),
  ])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{"INVESTOR DASHBOARD".toUpperCase()}</h1>
      <p className="text-muted-foreground">
        {"DISCOVER STARTUPS • EXPRESS INTEREST • TRACK DISCUSSIONS".toUpperCase()}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"YOUR STARTUPS".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(startups ?? []).map((s: any) => (
              <li key={s.id}>{`${s.name} • ${s.stage || "UNKNOWN"}`.toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"ADD STARTUP".toUpperCase()}
          </Link>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">{"YOUR INTERESTS".toUpperCase()}</h2>
          <ul className="list-disc pl-5 text-sm">
            {(interests ?? []).map((i: any) => (
              <li key={i.id}>{`INTEREST #${i.id} • ${i.status} • ${i.amount ?? "N/A"}`.toUpperCase()}</li>
            ))}
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            {"FIND STARTUPS".toUpperCase()}
          </Link>
        </div>
      </div>
    </section>
  )
}
