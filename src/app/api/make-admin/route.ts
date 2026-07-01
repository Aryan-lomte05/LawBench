import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not logged in. Please log in first.' }, { status: 401 })
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let res;
  if (!profile) {
    // Insert new profile row
    res = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: 'Administrator',
        role: 'admin'
      })
      .select()
  } else {
    // Update existing profile
    res = await supabase
      .from('profiles')
      .update({ 
        role: 'admin',
        full_name: 'Administrator'
      })
      .eq('id', user.id)
      .select()
  }

  if (res.error) {
    return NextResponse.json({ error: res.error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `User ${user.email} has been successfully granted the 'admin' role!`,
    profile: res.data
  })
}
