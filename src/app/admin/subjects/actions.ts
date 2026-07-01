'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSubject(formData: {
  name: string
  slug: string
  description: string
  icon_name: string
  order_index: number
}) {
  const supabase = await createClient()

  // Verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('subjects')
    .insert([formData])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/subjects')
  revalidatePath('/subjects')
  revalidatePath('/')
  return { success: true }
}

export async function deleteSubject(id: string) {
  const supabase = await createClient()

  // Verify role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/subjects')
  revalidatePath('/subjects')
  revalidatePath('/')
  return { success: true }
}
