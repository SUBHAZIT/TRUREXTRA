"use client"

import { type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function ModalShell({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode
  onClose: () => void
  labelledBy: string
}) {
  // Mount gate to avoid SSR mismatch when using document in portal
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onEsc)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gray-900 text-white rounded-xl max-w-md w-full mx-4 p-8 border border-white/20 ring-1 ring-white/20 shadow-2xl max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>,
    document.body,
  )
}
