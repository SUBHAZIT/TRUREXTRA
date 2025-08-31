"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()

  function handleLogout() {
    try {
      // Remove common local keys for all dashboards
      const keys = [
        "student_profile",
        "student_posts",
        "student_submissions",
        "practice:selectedId",
        "mentor_profile",
        "mentor_requests",
        "mentor_sessions",
        "mentor_resources",
        "mentor_mentees",
        "mentor_notifications",
        "recruiter_profile",
        "investor_profile",
        "organizer_profile",
        "institute_profile",
        "college_profile",
      ]
      keys.forEach((k) => localStorage.removeItem(k))
    } catch {}
    router.push("/")
  }

  return (
    <Button variant="outline" onClick={handleLogout} aria-label="Log out">
      Log out
    </Button>
  )
}
