import { createClient } from '@supabase/supabase-js'

const getEnvValue = (key) => {
  if (typeof globalThis !== 'undefined' && typeof globalThis.Deno !== 'undefined' && typeof globalThis.Deno.env?.get === 'function') {
    return globalThis.Deno.env.get(key)
  }
  return process?.env?.[key]
}

const supabaseUrl = getEnvValue('SUPABASE_URL')
const supabaseServiceRoleKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables')
}

let normalizedUrl = supabaseUrl
if (/^https?:[^/]/.test(normalizedUrl)) {
  normalizedUrl = normalizedUrl.replace(/^https?:/, '$&//')
}
if (!/^https?:\/\//.test(normalizedUrl)) {
  normalizedUrl = `https://${normalizedUrl}`
}

const supabase = createClient(normalizedUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export default supabase
