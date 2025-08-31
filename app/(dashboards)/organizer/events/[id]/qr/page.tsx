"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export default function EventQrPage({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const checkinUrl = origin
    ? `${origin}/organizer/events/${params.id}/check-in`
    : `/organizer/events/${params.id}/check-in`

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, checkinUrl, { width: 256 }, (err) => {
      if (err) console.error("[v0] QR render error:", err)
    })
  }, [checkinUrl])

  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Event Check-in QR</h1>
      <p className="text-sm opacity-80 mb-6">Ask attendees to scan this QR to check in.</p>
      <canvas ref={canvasRef} className="mx-auto mb-4" aria-label="Event check-in QR code" />
      <a href={checkinUrl} className="text-blue-400 underline break-all">
        {checkinUrl}
      </a>
    </main>
  )
}
