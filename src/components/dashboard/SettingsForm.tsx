'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  profile: any
  userEmail?: string
}

export function SettingsForm({ profile, userEmail }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id)

      if (error) throw error
      
      toast.success('Profile updated successfully')
      router.refresh()
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const labelClass = "text-[13px] font-medium text-[#14171F] font-sans block mb-1.5"
  const inputClass = "w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
  const disabledClass = "w-full bg-[#EDE8DD] border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#8A949E] font-sans cursor-not-allowed"

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-md">
      <div className="flex flex-col">
        <label htmlFor="email" className={labelClass}>Email Address</label>
        <input 
          id="email" 
          type="email" 
          value={userEmail || ''} 
          disabled 
          className={disabledClass}
        />
        <p className="text-[11px] text-[#8A949E] mt-1.5 font-mono">Your email cannot be changed here.</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="fullName" className={labelClass}>Full Name</label>
        <input 
          id="fullName" 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary h-11 px-6 text-xs uppercase tracking-wider font-semibold">
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
