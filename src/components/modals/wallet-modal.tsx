'use client'

import { useUser } from '@/Context/UserContext'
import { signOutAction } from '@/app/actions/authActions' // Import the server-side signOutAction
import { useEffect, useState } from 'react'
import { RiAccountCircleLine } from 'react-icons/ri'
import { Button } from '../ui/button'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOutAction() // Call the server-side logout action
  }

  return (
    <Button className="w-full" onClick={handleLogout}>
      Logout
    </Button>
  )
}

const ConnectButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser() // Fetch the user directly
      setUser(user ?? null) // Set the user
    }
    getUser()
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {user ? (
        <RiAccountCircleLine
          onClick={openModal}
          className="size-8 cursor-pointer"
        />
      ) : (
        <Button onClick={() => router.push('/sign-in')}>
          Login
        </Button>
      )}

      {isModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-96 rounded-lg bg-secondary p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-primary hover:text-primary-foreground"
              onClick={closeModal}
            >
              &times;
            </button>

            <div>
              <h3 className="mb-4 text-lg font-bold text-primary">
                User Details
              </h3>
              <p>Email: {user.email}</p>
              <p>Last Sign-In: {user.last_sign_in_at}</p>

              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConnectButton
