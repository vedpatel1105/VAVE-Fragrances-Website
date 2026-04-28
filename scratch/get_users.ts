import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tuqdytehmpzhlbxfvylv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cWR5dGVobXB6aGxieGZ2eWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjIxNjYsImV4cCI6MjA2NDg5ODE2Nn0.cCRP9BQ7oRbytk-pRBinYFpmcbXTN0CdMYqaRCN_ep0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('email, full_name')
    .limit(50)
  
  if (error) {
    console.error('Error fetching users:', error)
    return
  }
  
  console.log('Users found:', data)
}

getUsers()
