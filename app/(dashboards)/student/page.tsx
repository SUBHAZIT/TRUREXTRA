import StudentDashboardClient from "./StudentDashboardClient"

export default async function StudentDashboardPage() {
  return (
    <main role="main" aria-label="Student Dashboard" className="min-h-screen relative overflow-hidden">
      {/* NOTE: CosmicBackground is provided globally via layout or components in this project.
         If it's not rendered here, the client includes its own gradients. */}
      <StudentDashboardClient />
    </main>
  )
}
