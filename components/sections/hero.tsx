import { GraduationCap, Users, Building2, School } from "lucide-react"
import BrandLogos from "../brand-logos"

export function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 px-6 md:px-12 text-white relative">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-900/30 backdrop-blur-sm border border-blue-700/30">
          <span className="text-blue-300 font-medium">THE FUTURE OF PROFESSIONAL DEVELOPMENT</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl mx-auto mt-6">
          {"CONNECT. LEARN. "}
          <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#7FDBFF,#0074D9,#001f3f)]">
            GROW.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mt-6">
          The ultimate platform for students, mentors, recruiters, organizers, investors, and colleges to collaborate in
          a unified ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <a href="#cta" className="inline-flex">
            <button className="hero-btn px-8 py-4 rounded-xl font-bold text-lg bg-[linear-gradient(90deg,#0074D9,#001f3f)] transition">
              GET STARTED FOR FREE
            </button>
          </a>
          <a href="#features" className="inline-flex">
            <button className="px-8 py-4 rounded-xl font-bold text-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
              VIEW DEMO
            </button>
          </a>
        </div>

        {/* glow accents */}
        <div className="mt-16 relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl" />

          {/* Trusted by card */}
          <div className="relative p-8 mx-auto max-w-4xl rounded-2xl bg-white/5 border border-white/10">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold mb-2">Trusted by Industry Leaders</h3>
              <p className="text-blue-200">Join thousands of professionals transforming their careers</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Students", value: "15K+", Icon: GraduationCap },
                { label: "Mentors", value: "3K+", Icon: Users },
                { label: "Companies", value: "500+", Icon: Building2 },
                { label: "Colleges", value: "120+", Icon: School },
              ].map((s) => (
                <div key={s.label} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  {/* icon badge */}
                  <div
                    aria-hidden
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto mb-4 flex items-center justify-center"
                  >
                    <s.Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-lg flex items-center justify-center gap-2">
                    {/* inline icon (kept subtle to avoid duplication, can remove if too much) */}
                    <s.Icon className="w-4 h-4 text-white/80" aria-hidden="true" />
                    <span>{s.label}</span>
                  </h4>
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#7FDBFF,#0074D9,#001f3f)] mt-2">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <BrandLogos className="mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* local styles for hero button hover and float (used by cosmic bg) */}
      <style>{`
        .hero-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.3) }
      `}</style>
    </section>
  )
}
