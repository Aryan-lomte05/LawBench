'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { submitContactMessage } from '@/app/contact/actions'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending) return

    setIsPending(true)
    try {
      const res = await submitContactMessage({ name, email, message })
      if (res.success) {
        toast.success('Message sent successfully!')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        toast.error(res.error || 'Failed to send message.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          placeholder="Jane Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="jane@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          placeholder="How can we help you?" 
          className="min-h-[150px] resize-y"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          disabled={isPending}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 text-lg font-medium shadow-md bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold"
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
