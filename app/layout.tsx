import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CosmicBackground } from "../components/cosmic-background"

const geistSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "TRUREXTRA- The Ultimate Platform for Students and Professionals",
  description: "#1 Platform for Students and Professionals",
  generator: "Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground uppercase tracking-wide">
        <CosmicBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
