'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUserAction(userId: string) {
  const supabase = await createClient()

  // Verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createClient()

  // Verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Delete from auth.users (since profiles cascades delete, or we delete profile directly)
  // Note: Admin delete user from auth requires admin privileges via supabase auth admin API.
  // In a standard client client, deleting from public.profiles table is direct if RLS permits.
  // Let's delete the profile directly, or reject it.
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  return { success: true }
}
