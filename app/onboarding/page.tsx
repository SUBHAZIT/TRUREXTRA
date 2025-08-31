import { redirect } from "next/navigation"
import { getServerSupabase } from "@/lib/supabase/server"
import OnboardingForm from "./ui/onboarding-form"

export default async function OnboardingPage() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/")

  const { data: profile } = await supabase.from("profiles").select("id, role").eq("id", user.id).maybeSingle()
  if (profile) {
    // Simple role routing; adjust if you want different defaults
    redirect("/student")
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold uppercase mb-2">Complete your profile</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Choose your role and add a few details to personalize your dashboard.
      </p>
      <OnboardingForm />
    </main>
  )
}
