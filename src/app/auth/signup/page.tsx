'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import LinkNext from 'next/link'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-heading font-semibold text-[#14171F] leading-tight">
          Create an account
        </h1>
        <p className="text-[14px] text-[#5B6470] font-sans mt-2">
          Enter your details below to create your library account.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[13px] font-medium text-[#14171F] font-sans">
            Full Name
          </label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            placeholder="Jane Doe" 
            required 
            disabled={isPending}
            className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-[#14171F] font-sans">
            Email Address
          </label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            disabled={isPending}
            className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] font-medium text-[#14171F] font-sans">
            Password
          </label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            disabled={isPending}
            className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
          />
        </div>
        
        {state?.error && (
          <p className="text-xs font-mono uppercase tracking-wider text-[#C0392B]">{state.error}</p>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary w-full h-12 text-[14px] font-semibold tracking-wide uppercase"
        >
          {isPending ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-[13px] text-[#5B6470] font-sans">
        Already have an account?{' '}
        <LinkNext href="/auth/login" className="font-semibold text-[#5B6470] hover:text-[#14171F] transition-colors">
          Sign in
        </LinkNext>
      </div>
      
      <p className="text-center text-[12px] text-[#8A949E] font-sans leading-relaxed">
        By clicking continue, you agree to our{' '}
        <LinkNext href="/terms" className="underline hover:text-[#14171F] transition-colors">
          Terms of Service
        </LinkNext>{' '}
        and{' '}
        <LinkNext href="/privacy" className="underline hover:text-[#14171F] transition-colors">
          Privacy Policy
        </LinkNext>.
      </p>
    </div>
  )
}
