import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const publicPaths = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/api/auth/confirm'
  ]

  // Log the current path to verify it matches public paths
  const pathname = request.nextUrl.pathname
  console.log(`Request path: ${pathname}`)

  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log(`Allowing access to public path: ${pathname}`)
    return NextResponse.next() // Skip auth checks for public paths
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated; if not, redirect to /sign-in
  if (!user) {
    console.log(`No user found. Redirecting to /sign-in from ${pathname}`)
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // User authenticated, allow access
  console.log(`User authenticated for path: ${pathname}`)
  return NextResponse.next()
}
