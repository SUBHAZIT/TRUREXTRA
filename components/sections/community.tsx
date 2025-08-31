"use client"

export function Community() {
  const metrics = [
    { label: "ACTIVE USERS", value: "50K+" },
    { label: "COUNTRIES", value: "120+" },
    { label: "PARTNER COMPANIES", value: "500+" },
    { label: "SUPPORT", value: "24/7" },
  ]
  const chips = [
    { name: "Alex Johnson", role: "Student", grad: "from-blue-400 to-indigo-600" },
    { name: "Sarah Williams", role: "Mentor", grad: "from-indigo-400 to-purple-600" },
    { name: "Michael Chen", role: "Recruiter", grad: "from-purple-400 to-pink-600" },
    { name: "Emma Rodriguez", role: "Organizer", grad: "from-pink-400 to-red-600" },
  ]

  return (
    <section id="community" className="relative z-20 isolate py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">JOIN OUR GLOBAL COMMUNITY</h2>
          <p className="text-xl text-foreground/80 mt-4">
            Connect with professionals, students, and innovators worldwide
          </p>
        </div>

        <div className="mt-16 relative">
          {/* softened but stronger backdrop behind the card for separation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-3xl blur-2xl" />
          <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl ring-1 ring-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#7FDBFF,#0074D9,#001f3f)]">
                    {m.value}
                  </div>
                  <div className="mt-2 text-white/85">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {chips.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${c.grad}`} />
                  <span className="text-white/90">{c.name}</span>
                  <span className="text-white/70">{c.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
