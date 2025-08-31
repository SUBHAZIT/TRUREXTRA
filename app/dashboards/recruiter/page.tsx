import Link from "next/link"
import RecruiterDashboardClient from "../../(dashboards)/recruiter/RecruiterDashboardClient"

export default function RecruiterDashboard() {
  return (
    <section className="space-y-6 uppercase">
      <h1 className="text-2xl font-bold">RECRUITER DASHBOARD</h1>
      <p className="text-muted-foreground">POST JOBS • AI SCREENING • INTERVIEW SCHEDULING</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">YOUR COMPANIES</h2>
          <ul className="list-disc pl-5 text-sm">
            <RecruiterDashboardClient />
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            ADD COMPANY
          </Link>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">JOB POSTS</h2>
          <ul className="list-disc pl-5 text-sm">
            <RecruiterDashboardClient />
          </ul>
          <Link className="underline text-blue-600 mt-2 inline-block" href="#">
            CREATE JOB POST
          </Link>
        </div>
      </div>
    </section>
  )
}
