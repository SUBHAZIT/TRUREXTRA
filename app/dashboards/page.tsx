import { redirect } from "next/navigation"
import { getServerSupabase } from "../../lib/supabase/server"

export default async function DashboardsIndex() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

  const role = (profile?.role || "student") as
    | "student"
    | "mentor"
    | "recruiter"
    | "organizer"
    | "investor"
    | "institute"

  redirect(`/dashboards/${role}`)
}
