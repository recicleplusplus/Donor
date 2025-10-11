import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aodaulmxfmddwiefvofs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZGF1bG14Zm1kZHdpZWZ2b2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTE1OTksImV4cCI6MjA3NTc2NzU5OX0.eC-etMYklAe7xEMljNpGt8aDvjXSsPcIKNCzG7vEDJk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)