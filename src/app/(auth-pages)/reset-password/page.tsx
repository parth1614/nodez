import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from '@/app/actions/authActions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { message: Message; token?: string }
}) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
  
    // If no session, redirect to forgot password
    if (!session) {
      redirect('/forgot-password?message=Invalid or expired reset link')
    }

  return (
    <div className="w-screen flex items-center h-screen justify-center gap-2 p-4">
      <form className="flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
        <div className="">
          <h1 className="text-2xl font-medium py-2">Set New Password</h1>
          <p className="text-sm text-secondary-foreground">
            Enter your new password below
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <input 
            type="hidden" 
            name="token" 
            value={searchParams.token} 
          />
          
          <Label htmlFor="password">New Password</Label>
          <Input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            required 
            minLength={6}
          />
          
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            type="password" 
            name="confirmPassword" 
            placeholder="••••••••" 
            required 
            minLength={6}
          />
          
          <SubmitButton formAction={resetPasswordAction}>
            Update Password
          </SubmitButton>
          <FormMessage message={searchParams.message} />
        </div>
      </form>
    </div>
  )
}