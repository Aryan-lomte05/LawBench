const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('comment_votes')
    .select('*')
    .limit(1)
  
  if (error) {
    console.log("comment_votes error:", error.message)
  } else {
    console.log("comment_votes exists! Data:", data)
  }

  const { data: cols, error: colError } = await supabase
    .from('comments')
    .select('blog_post_id')
    .limit(1)
  
  if (colError) {
    console.log("comments.blog_post_id error:", colError.message)
  } else {
    console.log("comments.blog_post_id exists! Data:", cols)
  }
}

test()
