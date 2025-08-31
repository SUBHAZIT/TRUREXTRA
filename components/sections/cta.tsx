export function CTA() {
  return (
    <section id="cta" className="py-20 px-6 md:px-12 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">READY TO TRANSFORM YOUR PROFESSIONAL JOURNEY?</h2>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
          Join thousands of professionals already using TRUREXTRA to connect, learn, and grow.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#signup" className="inline-flex">
            <button className="px-8 py-4 rounded-xl font-bold text-lg bg-[linear-gradient(90deg,#0074D9,#001f3f)] transition hero-btn">
              CREATE FREE ACCOUNT
            </button>
          </a>
          <a href="#contact" className="inline-flex">
            <button className="px-8 py-4 rounded-xl font-bold text-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
              SCHEDULE A DEMO
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}
