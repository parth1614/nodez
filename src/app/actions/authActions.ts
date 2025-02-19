'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { encodedRedirect } from '~/utils/utils'

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const supabase = createClient()
  const origin = headers().get('origin')

  console.log('Login request from origin ', origin)
  console.log('Email', email)

  if (!email || !password) {
    console.log('Email and password are required')
    return { error: 'Email and password are required' }
  }

  // Try to sign up - Supabase will return an error if the email exists
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  })
  console.log('error', error)
  console.log('data', data)

  if (error) {
    console.error(error.code + ' ' + error.message)
    return encodedRedirect('error', '/sign-up', error.message)
  }

  // Check if user already exists (Supabase returns user data but no session)
  if (data?.user && !data?.session) {
    const { identities } = data.user
    if (identities && identities.length === 0) {
      return encodedRedirect(
        'success',
        '/sign-in',
        'An account with this email already exists. Please sign in.'
      )
    }
  }

  console.log('User created successfully')
  return encodedRedirect('success', '/confirm-email', email)
}

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message)
  }
  const user = await supabase.auth.getUser()
  console.log(user, 'user from login')
  if (user) {
    revalidatePath('/', 'layout')
  }
  return redirect('/')
}

// export const forgotPasswordAction = async (formData: FormData) => {
//   const email = formData.get('email')?.toString()
//   const supabase = createClient()
//   const origin = headers().get('origin')
//   const callbackUrl = formData.get('callbackUrl')?.toString()

//   if (!email) {
//     return encodedRedirect('error', '/forgot-password', 'Email is required')
//   }

//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${origin}/api/auth/callback?redirect_to=/reset-password`,
//   })

//   if (error) {
//     console.error(error.message)
//     return encodedRedirect(
//       'error',
//       '/forgot-password',
//       'Could not reset password',
//     )
//   }

//   if (callbackUrl) {
//     return redirect(callbackUrl)
//   }

//   return encodedRedirect(
//     'success',
//     '/forgot-password',
//     'Check your email for a link to reset your password.',
//   )
// }

// export const resetPasswordAction = async (formData: FormData) => {
//   const supabase = createClient()

//   const password = formData.get('password') as string
//   const confirmPassword = formData.get('confirmPassword') as string

//   if (!password || !confirmPassword) {
//     encodedRedirect(
//       'error',
//       '/reset-password',
//       'Password and confirm password are required',
//     )
//   }

//   if (password !== confirmPassword) {
//     encodedRedirect('error', '/reset-password', 'Passwords do not match')
//   }

//   const { error } = await supabase.auth.updateUser({
//     password: password,
//   })

//   if (error) {
//     encodedRedirect('error', '/reset-password', 'Password update failed')
//   }

//   encodedRedirect('success', '/reset-password', 'Password updated')
// }

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = createClient()
  const origin = headers().get('origin')

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/confirm?type=recovery`,
  })

  if (error) {
    console.error(error.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password',
    )
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.',
  )
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'Password and confirm password are required',
    )
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/reset-password', 'Passwords do not match')
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) throw error

    // Sign out after password reset
    await supabase.auth.signOut()

    return encodedRedirect(
      'success',
      '/sign-in',
      'Password updated successfully. Please sign in with your new password.',
    )
  } catch (error: any) {
    return encodedRedirect(
      'error',
      '/reset-password',
      'Failed to update password',
    )
  }
}

export const signOutAction = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/sign-up')
}
