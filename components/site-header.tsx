"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/modals/login-modal"
import { SignupModal } from "@/components/modals/signup-modal"
import { ForgotModal } from "@/components/modals/forgot-modal"
import { Rocket } from "lucide-react"

type ModalType = "none" | "login" | "signup" | "forgot"

export function SiteHeader() {
  const [modal, setModal] = useState<ModalType>("none")

  return (
    <header
      className={cn(
        "fixed w-full z-50 py-4 px-6 md:px-12",
        "bg-blue-900/30 backdrop-blur-md border-b border-white/10",
        "text-white",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
            <span className="sr-only">TRUREXTRA</span>
            <Rocket className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold">TRUREXTRA</h1>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="nav-link font-medium uppercase text-white/90 hover:text-white">
            HOME
          </a>
          <a href="#features" className="nav-link font-medium uppercase text-white/90 hover:text-white">
            FEATURES
          </a>
          <a href="#roles" className="nav-link font-medium uppercase text-white/90 hover:text-white">
            ROLES
          </a>
          <a href="#community" className="nav-link font-medium uppercase text-white/90 hover:text-white">
            COMMUNITY
          </a>
          <a href="#testimonials" className="nav-link font-medium uppercase text-white/90 hover:text-white">
            TESTIMONIALS
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition"
            onClick={() => setModal("login")}
          >
            LOGIN
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition"
            onClick={() => setModal("signup")}
          >
            SIGN UP
          </button>
        </div>
      </div>

      {modal === "login" && (
        <LoginModal
          onClose={() => setModal("none")}
          onForgot={() => setModal("forgot")}
          onSignup={() => setModal("signup")}
        />
      )}
      {modal === "signup" && <SignupModal onClose={() => setModal("none")} onLogin={() => setModal("login")} />}
      {modal === "forgot" && <ForgotModal onClose={() => setModal("none")} onBackToLogin={() => setModal("login")} />}

      <style>{`
        .nav-link { position: relative; padding-bottom: 5px; }
        .nav-link::after {
          content: ""; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
          background: linear-gradient(90deg, #7FDBFF, #0074D9); transition: width .3s ease;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>
    </header>
  )
}
