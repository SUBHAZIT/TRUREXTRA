export const dynamic = 'error'
// Client sends x-localstorage-funding-requests header with JSON array; we return updated list.

type FundingRequest = {
  id: string
  startup: string
  amount: number
  notes?: string
  status: "pending" | "approved" | "declined"
  createdAt: string
}

function readFromHeader(req: Request): FundingRequest[] {
  const raw = req.headers.get("x-localstorage-funding-requests") || "[]"
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  const items = readFromHeader(request)
  return Response.json({ items })
}

export async function POST(request: Request) {
  const items = readFromHeader(request)
  const body = await request.json().catch(() => ({}))
  const startup = String(body?.startup || "").trim()
  const amountNum = Number(body?.amount)
  const notes = String(body?.notes || "").trim()
  if (!startup || !Number.isFinite(amountNum) || amountNum <= 0) {
    return new Response(JSON.stringify({ error: "Valid startup and amount are required" }), { status: 400 })
  }
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const createdAt = new Date().toISOString()
  const next: FundingRequest[] = [{ id, startup, amount: amountNum, notes, status: "pending", createdAt }, ...items]
  return Response.json({ items: next })
}

export async function PATCH(request: Request) {
  const items = readFromHeader(request)
  const body = await request.json().catch(() => ({}))
  const id = String(body?.id || "")
  const status = body?.status as FundingRequest["status"]
  if (!id || !status || !["pending", "approved", "declined"].includes(status)) {
    return new Response(JSON.stringify({ error: "id and valid status are required" }), { status: 400 })
  }
  const next = items.map((r) => (r.id === id ? { ...r, status } : r))
  return Response.json({ items: next })
}

export async function DELETE(request: Request) {
  const items = readFromHeader(request)
  const body = await request.json().catch(() => ({}))
  const id = String(body?.id || "")
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 })
  const next = items.filter((r) => r.id !== id)
  return Response.json({ items: next })
}
