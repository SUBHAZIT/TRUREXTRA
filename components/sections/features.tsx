import { Bot, UsersRound, LineChart, CalendarClock, Briefcase, Lightbulb } from "lucide-react"

export function Features() {
  const data = [
    {
      title: "AI MENTOR",
      desc: "Personalized guidance powered by advanced AI to accelerate your learning journey.",
      icon: Bot,
    },
    {
      title: "PROFESSIONAL NETWORK",
      desc: "Connect with industry experts, peers, and collaborators worldwide.",
      icon: UsersRound,
    },
    {
      title: "SKILL TRACKING",
      desc: "Visualize progress and find focus areas with detailed analytics.",
      icon: LineChart,
    },
    {
      title: "EVENT MANAGEMENT",
      desc: "Host and participate in hackathons, workshops, and networking events.",
      icon: CalendarClock,
    },
    { title: "JOB MATCHING", desc: "Discover opportunities tailored to your skills and goals.", icon: Briefcase },
    { title: "INNOVATION HUB", desc: "Resources, funding, and mentorship for your startup ideas.", icon: Lightbulb },
  ]
  return (
    <section id="features" className="py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold uppercase">POWERFUL FEATURES FOR ALL ROLES</h2>
          <p className="text-xl text-blue-200 mt-4 uppercase">
            EVERYTHING YOU NEED TO CONNECT, LEARN, AND GROW PROFESSIONALLY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {data.map((f) => (
            <div key={f.title} className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div
                aria-hidden
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-[linear-gradient(135deg,rgba(127,219,255,.2),rgba(0,116,217,.2))] backdrop-blur"
              >
                <f.icon className="w-7 h-7 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3 uppercase">{f.title}</h3>
              <p className="text-blue-100 uppercase">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
