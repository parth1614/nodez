'use client'
import { useUser } from '@/Context/UserContext'
import { migrateUserIdByWalletAddresss } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { createClient } from '@/utils/supabase/client'

export default function BannerDialog() {
  const supabase = createClient()
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user ?? null)
    }
    getUser()
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [migrationStatus, setMigrationStatus] = useState<string>('')

  const handleMigration = async () => {
    if (!address || !user?.id) {
      setMigrationStatus('Wallet or user not found')
      return
    }

    try {
      setIsLoading(true)
      setMigrationStatus('Migrating orders...')

      const result = await migrateUserIdByWalletAddresss(address, user.id)

      if (result?.success) {
        if ('completedOrdersCount' in result) {
          setMigrationStatus(
            result.message ??
              `Successfully migrated ${result.completedOrdersCount} orders`,
          )
        } else {
          setMigrationStatus(result.message ?? 'Migration failed')
        }
      } else {
        setMigrationStatus(result.message ?? 'Migration failed')
      }
    } catch (error) {
      console.error('Error during migration:', error)
      setMigrationStatus('Error during migration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      await open()
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-gradient-to-r from-black to-green-600 text-white shadow-lg border-2 border-green-600">
      {!isConnected ? (
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-8 sm:px-6 md:flex-row md:py-12 lg:px-8">
          <div className="mb-6 flex items-center md:mb-0">
            <Wallet
              className="mr-4 h-12 w-12 text-yellow-300"
              aria-hidden="true"
            />
            <div>
              <h2 className="mb-2 text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-lg text-purple-100">
                Link your wallet to migrate your previous transactions
              </p>
            </div>
          </div>
          <Button
            className={`rounded-full bg-white px-6 py-3 font-semibold text-black shadow-md transition-colors duration-300 ${
              isLoading
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-green-100 hover:text-green-700'
            }`}
            onClick={handleConnectWallet}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Wallet className="h-8 w-8 text-yellow-300" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">Wallet Connected</h2>
                <p className="text-sm text-gray-200 mt-1">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                {migrationStatus && (
                  <p className="text-sm mt-1 text-green-200">
                    {migrationStatus}
                  </p>
                )}
              </div>
            </div>
            <Button
              className={`rounded-full bg-white px-6 py-2 font-semibold text-black shadow-md transition-colors duration-300 ${
                isLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-green-100 hover:text-green-700'
              }`}
              onClick={handleMigration}
              disabled={isLoading}
            >
              {isLoading ? 'Migrating...' : 'Migrate Orders'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
