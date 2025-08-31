"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function StudentLogoutButton() {
  const router = useRouter()

  function handleLogout() {
    try {
      // Remove common student/mentor local keys without nuking unrelated app data
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
