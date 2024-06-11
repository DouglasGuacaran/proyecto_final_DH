import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL='https://sazbeqvdotgnznhvwglg.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemJlcXZkb3RnbnpuaHZ3Z2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NDYyNzYsImV4cCI6MjAzMTEyMjI3Nn0.fXqkFe1zssvfW77AvbwKzChXWEW5demodEPnq6vP_j8'
  )
}
const supabase = createClient();
export default supabase;