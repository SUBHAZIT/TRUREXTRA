import { revalidatePath } from "next/cache"
import { getServerSupabase } from "@/lib/supabase/server"

async function saveExternalProfile(formData: FormData) {
  "use server"
  const supabase = getServerSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) {
    throw new Error("NOT AUTHENTICATED")
  }

  const provider = String(formData.get("provider") || "").toUpperCase()
  const handle = String(formData.get("handle") || "").trim()
  const url = String(formData.get("url") || "").trim()

  if (!provider || (!handle && !url)) {
    throw new Error("MISSING FIELDS")
  }

  const { error } = await supabase
    .from("external_profiles")
    .upsert(
      {
        user_id: user.id,
        provider,
        handle: handle || null,
        url: url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" },
    )
    .select()

  if (error) throw error

  revalidatePath("/dashboards/integrations")
}

export const dynamic = "force-dynamic"

export default async function IntegrationsPage() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: rows } = await supabase
    .from("external_profiles")
    .select("provider, handle, url, updated_at")
    .eq("user_id", user?.id ?? "")

  return (
    <main className="mx-auto w-full max-w-4xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">EXTERNAL INTEGRATIONS</h1>
        <p className="text-sm opacity-80">
          CONNECT YOUR ACCOUNTS. TODAY WE STORE YOUR HANDLES/URLS. FULL OAUTH FLOWS (LINKEDIN, LEETCODE, UNSTOP) CAN BE
          ENABLED NEXT.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { name: "LINKEDIN", provider: "LINKEDIN", placeholder: "PROFILE URL (HTTPS://…)", field: "url" },
          { name: "LEETCODE", provider: "LEETCODE", placeholder: "USERNAME (E.G. JANE_DOE)", field: "handle" },
          { name: "UNSTOP", provider: "UNSTOP", placeholder: "PROFILE URL (HTTPS://…)", field: "url" },
        ].map((card) => (
          <div key={card.provider} className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">{card.name}</h2>
            <form action={saveExternalProfile} className="space-y-3">
              <input type="hidden" name="provider" value={card.provider} />
              <input
                name={card.field}
                placeholder={card.placeholder}
                className="w-full rounded border px-3 py-2 bg-background"
              />
              <button className="w-full rounded bg-blue-600 px-3 py-2 text-white">SAVE</button>
            </form>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">CONNECTED</h3>
        <div className="rounded border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-3 py-2">PROVIDER</th>
                <th className="px-3 py-2">HANDLE/URL</th>
                <th className="px-3 py-2">UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((r, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-3 py-2">{r.provider}</td>
                  <td className="px-3 py-2">{r.handle || r.url || "-"}</td>
                  <td className="px-3 py-2">
                    {r.updated_at ? new Date(r.updated_at).toLocaleString().toUpperCase() : "-"}
                  </td>
                </tr>
              ))}
              {(!rows || rows.length === 0) && (
                <tr>
                  <td className="px-3 py-4 text-center opacity-70" colSpan={3}>
                    NO CONNECTIONS YET
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-lg font-semibold">NEXT STEPS</h3>
        <ul className="list-disc pl-6 text-sm opacity-80">
          <li>ADD OAUTH: AUTH.JS PROVIDERS FOR LINKEDIN/GENERIC OAUTH</li>
          <li>PER-USER IMPORTS FROM LINKEDIN/UNSTOP WHEN CONNECTED</li>
          <li>LEETCODE STATS VIA PUBLIC PROFILE OR EXPORTS</li>
        </ul>
      </section>
    </main>
  )
}
