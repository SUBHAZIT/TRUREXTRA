export const dynamic = 'error'
// The client must send header: x-localstorage-pitch-decks = JSON string of current array.
// We return the updated array; the client is responsible for persisting back to localStorage.

type PitchDeck = {
  id: string
  title: string
  url: string
  createdAt: string
}

function readFromHeader(req: Request): PitchDeck[] {
  const raw = req.headers.get("x-localstorage-pitch-decks") || "[]"
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
  const title = String(body?.title || "").trim()
  const url = String(body?.url || "").trim()
  if (!title || !url) {
    return new Response(JSON.stringify({ error: "Title and URL are required" }), { status: 400 })
  }
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const createdAt = new Date().toISOString()
  const next: PitchDeck[] = [{ id, title, url, createdAt }, ...items]
  return Response.json({ items: next })
}

export async function DELETE(request: Request) {
  const items = readFromHeader(request)
  const body = await request.json().catch(() => ({}))
  const id = String(body?.id || "")
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 })
  const next = items.filter((d) => d.id !== id)
  return Response.json({ items: next })
}
