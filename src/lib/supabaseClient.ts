import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vleyskdqqxtwtypzzxzj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXlza2RxcXh0d3R5cHp6eHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODUzNzEsImV4cCI6MjA2NzU2MTM3MX0.lDYL015ZkWLpVF0edN2E8cMdShkM3ONO_YIOeE19h6I'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 