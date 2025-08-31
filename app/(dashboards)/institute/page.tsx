import InstituteDashboardClient from "./InstituteDashboardClient"

export const metadata = {
  title: "Institute Dashboard",
}

export default function Page() {
  return (
    // ALL CAPS scoped only to this dashboard
    <section className="uppercase text-foreground min-h-screen relative overflow-hidden">
      <InstituteDashboardClient />
    </section>
  )
}
