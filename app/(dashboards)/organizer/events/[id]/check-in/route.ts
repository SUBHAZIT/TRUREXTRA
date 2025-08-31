export const dynamic = "force-static"

import { NextResponse, type NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = new URL(req.url).origin
  const res = await fetch(`${origin}/api/events/${params.id}/checkin`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") || "" },
  })
  const success = res.ok
  const url = new URL(success ? "/organizer/check-in/success" : "/organizer/check-in/error", origin)
  return NextResponse.redirect(url)
}
