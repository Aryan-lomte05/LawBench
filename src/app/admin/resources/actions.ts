'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteResource(id: string) {
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
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  revalidatePath(`/resources/${id}`)
  return { success: true }
}

export async function createResource(formData: {
  title: string
  description: string
  type: string
  subject_id: string
  semester: string
  unit: string
  author_or_uploader: string
  url: string
  is_published: boolean
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
    .from('resources')
    .insert([formData])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  return { success: true }
}

export async function uploadFileAction(base64Data: string, fileName: string, contentType: string) {
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

  // Try to create the bucket in case it doesn't exist
  await supabase.storage.createBucket('resources', {
    public: true,
    allowedMimeTypes: ['application/pdf'],
    fileSizeLimit: 10 * 1024 * 1024 // 10MB
  }).catch(() => {
    // Ignore error if bucket already exists
  })

  const buffer = Buffer.from(base64Data, 'base64')
  const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`

  const { error } = await supabase.storage
    .from('resources')
    .upload(uniqueName, buffer, {
      contentType,
      upsert: true
    })

  if (error) {
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('resources')
    .getPublicUrl(uniqueName)

  return { success: true, url: publicUrl }
}

export async function updateResource(
  id: string,
  formData: {
    title: string
    description: string
    type: string
    subject_id: string
    semester: string
    unit: string
    author_or_uploader: string
    url: string
    is_published: boolean
  }
) {
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
    .from('resources')
    .update(formData)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  revalidatePath(`/resources/${id}`)
  return { success: true }
}
