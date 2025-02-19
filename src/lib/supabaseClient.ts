import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
