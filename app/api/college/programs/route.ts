export const dynamic = 'error'

import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: userData, error: uerr } = await supabase.auth.getUser()
  if (uerr || !userData?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { data, error } = await supabase
    .from("college_programs")
    .select("*")
    .eq("college_id", userData.user.id)
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const supabase = getServerSupabase()
  const { data: userData, error: uerr } = await supabase.auth.getUser()
  if (uerr || !userData?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { name, description } = body ?? {}
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })
  const { data, error } = await supabase
    .from("college_programs")
    .insert([{ college_id: userData.user.id, name, description: description || null }])
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
