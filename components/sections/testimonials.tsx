"use client"

export function Testimonials() {
  const items = [
    {
      name: "James Wilson",
      role: "Software Engineer at TechCorp",
      avatarGrad: "from-blue-400 to-indigo-600",
      quote:
        "“TRUREXTRA helped me connect with mentors who guided my career transition. The AI-powered skill tracking showed me exactly where to focus my efforts.”",
      stars: 5,
    },
    {
      name: "Priya Sharma",
      role: "University Placement Officer",
      avatarGrad: "from-indigo-400 to-purple-600",
      quote:
        "“Our college saw a 40% increase in student placements after integrating TRUREXTRA. The event management tools made organizing career fairs seamless.”",
      stars: 5,
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      avatarGrad: "from-purple-400 to-pink-600",
      quote:
        "“The investor matching feature connected us with our Series A funding. TRUREXTRA's innovation hub gave us the resources we needed to scale.”",
      stars: 4.5,
    },
  ]
  return (
    <section id="testimonials" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">WHAT OUR USERS SAY</h2>
          <p className="text-xl text-blue-200 mt-4">Real stories from professionals who transformed their careers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {items.map((t) => (
            <div key={t.name} className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${t.avatarGrad} mr-4`} />
                <div>
                  <h4 className="font-bold text-lg">{t.name}</h4>
                  <p className="text-blue-300">{t.role}</p>
                </div>
              </div>
              <p className="text-blue-100 italic">{t.quote}</p>
              <div className="flex mt-4 text-yellow-400" aria-label={`${t.stars} stars`}>
                {"★★★★★☆☆☆☆☆"
                  .slice(0, Math.round(t.stars))
                  .split("")
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                {t.stars % 1 !== 0 && <span>½</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
