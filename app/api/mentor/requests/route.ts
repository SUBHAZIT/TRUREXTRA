export const dynamic = 'error'

import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const uid = userData.user.id
  const { data, error } = await supabase.from("mentor_requests").select("*")
  // RLS will ensure only rows where uid is either student or mentor are returned
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const supabase = getServerSupabase()
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const { mentor_id, message } = body ?? {}
  if (!mentor_id) {
    return NextResponse.json({ error: "mentor_id is required" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("mentor_requests")
    .insert([{ student_id: userData.user.id, mentor_id, message: message || null }])
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
