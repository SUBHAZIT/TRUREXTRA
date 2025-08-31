export const dynamic = 'error'
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: userData, error: uerr } = await supabase.auth.getUser()
  if (uerr || !userData?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { data, error } = await supabase
    .from("college_students")
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
  const { student_id, program_id } = body ?? {}
  if (!student_id) return NextResponse.json({ error: "student_id is required" }, { status: 400 })
  const { data, error } = await supabase
    .from("college_students")
    .insert([{ college_id: userData.user.id, student_id, program_id: program_id || null }])
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
