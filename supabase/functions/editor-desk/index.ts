import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://judyzzzovo.github.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-editor-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders })

const sameText = (left: string, right: string) => {
  if (left.length !== right.length) return false
  let result = 0
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return result === 0
}

const asText = (value: unknown, maximum: number) =>
  typeof value === 'string' && value.length > 0 && value.length <= maximum ? value : null

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  const legacyKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const key = legacyKey || (secretKeys ? JSON.parse(secretKeys).default : undefined)
  if (!url || !key) throw new Error('Server credentials are not available.')
  return createClient(url, key, { auth: { persistSession: false } })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405)

  const expectedKey = Deno.env.get('EDITOR_KEY')
  const suppliedKey = request.headers.get('x-editor-key') || ''
  if (!expectedKey || !sameText(suppliedKey, expectedKey)) return reply({ error: 'Unauthorized.' }, 401)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return reply({ error: 'Invalid request.' }, 400)
  }

  try {
    const admin = adminClient()
    switch (body.action) {
      case 'verify':
        return reply({ ok: true })

      case 'list-pending': {
        const { data, error } = await admin.from('submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false })
        if (error) throw error
        return reply(data || [])
      }

      case 'review': {
        const id = asText(body.id, 80)
        const status = body.status
        if (!id || (status !== 'approved' && status !== 'rejected')) return reply({ error: 'Invalid review request.' }, 400)
        const { error } = await admin.from('submissions').update({ status }).eq('id', id)
        if (error) throw error
        return reply({ ok: true })
      }

      case 'delete-work': {
        const id = asText(body.id, 80)
        if (!id) return reply({ error: 'Invalid work id.' }, 400)
        const { data: work, error: findError } = await admin.from('submissions').select('object_path').eq('id', id).single()
        if (findError) throw findError
        if (work?.object_path) {
          const { error: storageError } = await admin.storage.from('submissions').remove([work.object_path])
          if (storageError) throw storageError
        }
        const { error } = await admin.from('submissions').delete().eq('id', id)
        if (error) throw error
        return reply({ ok: true })
      }

      case 'save-monthly-picks': {
        if (!Array.isArray(body.picks) || body.picks.length !== 4) return reply({ error: 'Choose exactly four monthly picks.' }, 400)
        const picks = body.picks.map((pick, index) => ({
          slot: Number.isInteger(pick?.slot) ? pick.slot : index,
          image_url: asText(pick?.image_url, 2000),
          author: asText(pick?.author, 120),
          updated_at: new Date().toISOString(),
        }))
        if (new Set(picks.map((pick) => pick.slot)).size !== 4 || picks.some((pick) => pick.slot < 0 || pick.slot > 3 || !pick.image_url || !pick.author)) {
          return reply({ error: 'Invalid monthly picks.' }, 400)
        }
        const { error } = await admin.from('monthly_picks').upsert(picks, { onConflict: 'slot' })
        if (error) throw error
        return reply({ ok: true })
      }

      default:
        return reply({ error: 'Unknown action.' }, 400)
    }
  } catch (error) {
    console.error(error)
    return reply({ error: 'The editor service could not complete that request.' }, 500)
  }
})
