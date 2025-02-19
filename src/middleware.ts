import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Add your protected routes here
    '/nodezpad',
    '/nodezpad/:path*',
    '/active-nodes',
    // You can add more protected routes as needed
  ],
}
