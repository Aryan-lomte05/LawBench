import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// GET: Fetch all comments for a target
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetId = searchParams.get('targetId')
  const targetType = searchParams.get('targetType')

  if (!targetId || !targetType) {
    return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    const selectFields = `
      id, parent_id, content, created_at, user_id,
      profiles (full_name, avatar_url),
      comment_votes (vote_type, user_id)
    `
    let query = supabase.from('comments').select(selectFields)

    if (targetType === 'resource') {
      query = query.eq('resource_id', targetId)
    } else {
      query = query.eq('blog_post_id', targetId)
    }

    const { data, error } = await query.order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, comments: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Add a comment
export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { targetId, targetType, content, parentId } = await request.json()

    if (!targetId || !targetType || !content?.trim()) {
      return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 })
    }

    const insertObj: any = {
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null
    }

    if (targetType === 'resource') {
      insertObj.resource_id = targetId
    } else {
      insertObj.blog_post_id = targetId
    }

    const { data, error } = await supabase
      .from('comments')
      .insert(insertObj)
      .select(`
        id, parent_id, content, created_at, user_id,
        profiles (full_name, avatar_url),
        comment_votes (vote_type, user_id)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, comment: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Remove a comment
export async function DELETE(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json({ error: 'Missing commentId.' }, { status: 400 })
    }

    // Check ownership or admin role
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (fetchError || !comment) {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    if (comment.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Comment deleted.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
