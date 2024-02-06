import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://brogfhxolkssbzzyjzxh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyb2dmaHhvbGtzc2J6enlqenhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMTA1NTksImV4cCI6MjAyMDU4NjU1OX0.Vw2FGLwVHJ13mhSkFb01nHtBpA2yC3bXaSC4H4fZBtw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)