export const dynamic = 'error'

import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const { data, error } = await supabase
    .from("mentor_sessions")
    .select("*")
    .eq("mentor_id", userData.user.id)
    .order("scheduled_at", { ascending: true })
    .order("created_at", { ascending: false })
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
  const { title, description, scheduled_at } = body ?? {}
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("mentor_sessions")
    .insert([{ mentor_id: userData.user.id, title, description, scheduled_at: scheduled_at || null }])
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
