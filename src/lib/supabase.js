import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hourylhzobbqxcgxgdns.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdXJ5bGh6b2JicXhjZ3hnZG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTk2MDYsImV4cCI6MjA5NjczNTYwNn0.QzUoXGDqEdGDDcaBsmxlQIjr6Qo6amoOHXcxvGT94FU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
