import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to vote.' }, { status: 401 })
    }

    const { postId, voteType } = await request.json()

    if (!postId || ![-1, 0, 1].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote parameters.' }, { status: 400 })
    }

    if (voteType === 0) {
      // Retract vote
      const { error } = await supabase
        .from('blog_post_votes')
        .delete()
        .eq('blog_post_id', postId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true, message: 'Vote retracted.' })
    } else {
      // Upsert vote
      const { error } = await supabase
        .from('blog_post_votes')
        .upsert({
          blog_post_id: postId,
          user_id: user.id,
          vote_type: voteType
        }, {
          onConflict: 'blog_post_id,user_id'
        })

      if (error) throw error
      return NextResponse.json({ success: true, message: 'Vote recorded.' })
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
