import { GraduationCap, Users, Briefcase, CalendarClock, LineChart, School } from "lucide-react"

export function Roles() {
  const roles = [
    {
      key: "student",
      title: "STUDENT",
      grad: "from-blue-500 to-indigo-600",
      icon: GraduationCap,
      bullets: ["Skill progression tracking", "AI mentor integration", "MCQ quiz system"],
      cta: "STUDENT DASHBOARD",
    },
    {
      key: "mentor",
      title: "MENTOR",
      grad: "from-indigo-500 to-purple-600",
      icon: Users,
      bullets: ["Professional community hub", "Session scheduling", "AI advisory features"],
      cta: "MENTOR DASHBOARD",
    },
    {
      key: "recruiter",
      title: "RECRUITER",
      grad: "from-purple-500 to-pink-600",
      icon: Briefcase,
      bullets: ["AI-powered CV shortlisting", "Job posting interface", "Interview scheduling"],
      cta: "RECRUITER DASHBOARD",
    },
    {
      key: "organizer",
      title: "ORGANIZER",
      grad: "from-pink-500 to-red-600",
      icon: CalendarClock,
      bullets: ["Event hosting interface", "QR check-in system", "Event analytics"],
      cta: "ORGANIZER DASHBOARD",
    },
    {
      key: "investor",
      title: "INVESTOR",
      grad: "from-red-500 to-orange-600",
      icon: LineChart,
      bullets: ["Startup connection interface", "AI pitch evaluator", "Interest management"],
      cta: "INVESTOR DASHBOARD",
    },
    {
      key: "college",
      title: "COLLEGE",
      grad: "from-orange-500 to-yellow-600",
      icon: School,
      bullets: ["College hub management", "Hackathon hosting", "Performance analytics"],
      cta: "COLLEGE DASHBOARD",
    },
  ]
  return (
    <section id="roles" className="py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">SIX DISTINCT USER ROLES</h2>
          <p className="text-xl text-blue-200 mt-4">Each with a dedicated dashboard and specialized tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.key} className="relative overflow-hidden p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" aria-hidden />
                <div className="relative z-10">
                  <div
                    aria-hidden
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${r.grad} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white/80" aria-hidden="true" />
                    <span>{r.title}</span>
                  </h3>
                  <ul className="space-y-2 text-blue-100">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1 inline-block h-3 w-3 rounded-full bg-green-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 font-medium hover:opacity-90 transition">
                    {r.cta}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
