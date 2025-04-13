import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://adrbdpuxelzszkimathz.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcmJkcHV4ZWx6c3praW1hdGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDMyMDYsImV4cCI6MjA1MzkxOTIwNn0.0c8rRMG9bi9rB2aRPD4w4VpBYAjIt4CGJsbtca1LUvI"

export const supabase = createClient(supabaseUrl, supabaseKey)
