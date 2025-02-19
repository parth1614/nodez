// app/api/auth/confirm/route.ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { encodedRedirect } from '~/utils/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Handle email confirmation
      if (type === 'signup') {
        return encodedRedirect(
          'success',
          '/sign-in',
          'Email confirmed successfully! You can now sign in.'
        )
      }
      
      // Handle password reset
      if (type === 'recovery') {
        return encodedRedirect(
          'success',
          '/reset-password',
          'You can now reset your password.'
        )
      }
    }

    // Handle errors based on type
    const errorPath = type === 'recovery' ? '/forgot-password' : '/sign-in'
    const errorMessage = type === 'recovery'
      ? 'Invalid or expired password reset link. Please try again.'
      : 'Invalid or expired confirmation link. Please try signing up again.'
    
    return encodedRedirect('error', errorPath, errorMessage)
  }

  return encodedRedirect('error', '/sign-in', 'Invalid link')
}