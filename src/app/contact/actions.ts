'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitContactMessage(formData: { name: string; email: string; message: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }
    ])

  if (error) {
    console.error("Error inserting contact message:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
