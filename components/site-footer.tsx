import { Rocket, Twitter, Linkedin, Github } from "lucide-react"
import { DiscordIcon } from "./icons/discord"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 pt-12 pb-8 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold">TRUREXTRA</h2>
            </div>
            <p className="text-blue-200 mb-6">THE ULTIMATE PLATFORM FOR PROFESSIONAL DEVELOPMENT AND COLLABORATION.</p>
            <div className="flex gap-4" aria-label="SOCIAL LINKS">
              <a
                href="https://twitter.com/your-handle"
                title="TWITTER"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Twitter className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="sr-only">TWITTER</span>
              </a>
              <a
                href="https://www.linkedin.com/company/your-company"
                title="LINKEDIN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Linkedin className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="sr-only">LINKEDIN</span>
              </a>
              <a
                href="https://github.com/your-org"
                title="GITHUB"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Github className="w-4 h-4 text-white" aria-hidden="true" />
                <span className="sr-only">GITHUB</span>
              </a>
              <a
                href="https://discord.gg/your-invite"
                title="DISCORD"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <DiscordIcon className="w-4 h-4 text-white" />
                <span className="sr-only">DISCORD</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">PRODUCT</h3>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/integrations" className="hover:text-white transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="/roadmap" className="hover:text-white transition">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="/changelog" className="hover:text-white transition">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">RESOURCES</h3>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="/documentation" className="hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/tutorials" className="hover:text-white transition">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition">
                  Community
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">COMPANY</h3>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/partners" className="hover:text-white transition">
                  Partners
                </a>
              </li>
              <li>
                <a href="/legal" className="hover:text-white transition">
                  Legal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-blue-300">
          <p>© {new Date().getFullYear()} TRUREXTRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
