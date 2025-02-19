'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('success')

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          We've sent a confirmation link to:
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Please check your email and click the confirmation link to complete your
          registration.
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <Button asChild variant="outline">
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Didn't receive the email?{' '}
            <Link href="/sign-up" className="text-primary underline">
              Try another email
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConfirmEmailPage() {
  return (
    <div className="flex w-screen items-center justify-center h-screen p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <p className="text-center mt-4">Loading...</p>
        </Card>
      }>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  )
}
