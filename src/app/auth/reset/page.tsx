'use client'

import { useActionState } from 'react'
import { resetPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reset Password</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            disabled={isPending}
          />
        </div>
        
        {state?.error && (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        )}
        
        {state?.success && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">{state.success}</p>
        )}

        <Button type="submit" className="w-full font-semibold transition-all hover:ring-1 hover:ring-primary/20" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Remember your password?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
