import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('=== Supabase Configuration Check ===')
console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Key:', supabaseAnonKey ? 'Set' : 'Missing')
console.log('Full URL:', supabaseUrl)

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

let supabase = null

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase client created successfully')
} else {
  console.warn('❌ Supabase not configured - using demo mode. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to your database.')
}

export { supabase }
