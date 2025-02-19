'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from '@/components/utils/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { signUpAction } from '@/app/actions/authActions'
import { FormMessage, Message } from '@/components/form-message'

const SignUpPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignUp />
  </Suspense>
)

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  const error = searchParams.get('error')
  const success = searchParams.get('success')

  let message: Message | null = null
  if (error) {
    message = { error: error.toString() }
  } else if (success) {
    message = { success: success.toString() }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true) // Set loading to true when the button is clicked
    await signUpAction(formData)
    setLoading(false) // Reset loading after the action is completed
  }

  return (
    <div className="flex w-screen items-center justify-center h-screen p-4">
      <div className="w-full max-w-md p-6 bg-background rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-center">
          Create Account
        </h1>
        <p className="text-sm text-center text-foreground mb-4">
          Already have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          handleSubmit(formData)
        }}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button
            className="w-full mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          {message && <FormMessage message={message} />}
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
