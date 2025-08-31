import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Roles } from "@/components/sections/roles"
import { CTA } from "@/components/sections/cta"
import { SiteFooter } from "@/components/site-footer"
import { CosmicBackground } from "@/components/cosmic-background"
import { Community } from "@/components/sections/community"
import { Testimonials } from "@/components/sections/testimonials"

export default function Page() {
  return (
    <>
      <CosmicBackground />
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Roles />
        <Community />
        <Testimonials />
        <CTA />
      </main>
      <SiteFooter />
    </>
  )
}
