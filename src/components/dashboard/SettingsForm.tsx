'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={userEmail || ''} 
          disabled 
          className="bg-muted/50 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Your email cannot be changed here.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
