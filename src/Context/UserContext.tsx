'use client'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

// Define the context type
type UserContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

// Create context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize with stored session if available
  const getStoredSession = async () => {
    const storedSession = await supabase.auth.getSession()
    if (storedSession?.data.session?.user) {
      setUser(storedSession.data.session.user)
      setIsAuthenticated(true)
      setLoading(false)
    }
  }
  useEffect(() => {
    getStoredSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setIsAuthenticated(!!currentUser)
        setLoading(false)
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook with proper type safety
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
