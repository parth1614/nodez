'use client'

import {
  getWalletFormData,
  updateWalletAddress,
} from '@/app/actions/nodes'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { completed_orders, SelectCompletedOrder } from '@/db/schema'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface WalletAddressFieldProps {
  order: SelectCompletedOrder,
  walletAddress: string,
  setWalletAddress: (walletAddress: string) => void,
}

export function WalletAddressField({ order, walletAddress, setWalletAddress }: WalletAddressFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWalletAddress = async () => {
      setIsLoading(true)
      const result = await getWalletFormData(order.id)
      if (result.success) {
        setWalletAddress(result.walletAddress ?? '')
      } else {
        console.error('Error fetching wallet address:', result.error)
        toast.error('Failed to fetch wallet address. Please try again.')
      }
      setIsLoading(false)
    }

    fetchWalletAddress()
  }, [order.id])

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true)
    setWalletAddress(e.target.value)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    if (!walletAddress.trim()) {
      toast.error('Please enter a wallet address')
      return
    }

    // if (!isAddress(walletAddress)) {
    //   toast.error('Please enter a valid Ethereum wallet address')
    //   return
    // }

    setIsUpdating(true)
    try {
      const result = await updateWalletAddress(order.id, walletAddress)
      if (result.success) {
        setIsEditing(false)
        toast.success('Wallet address updated successfully')
      } else {
        toast.error(result.error ?? 'Failed to update wallet address')
      }
    } catch (error) {
      console.error('Error updating wallet address:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="bg-primary-foreground text-primary">
      <CardHeader className="p-3">
        <CardDescription>Reward Wallet Address</CardDescription>
        <div className="flex items-center gap-2">
          <Input
            value={isLoading ? 'Loading...' : walletAddress}
            onChange={handleWalletChange}
            disabled={!isEditing || isLoading}
            placeholder="Enter your wallet address for rewards"
            className={`flex-grow font-mono ${isLoading ? 'opacity-50' : ''}`}
          />
          {!isEditing ? (
            <Button 
              onClick={handleEditClick} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={handleSaveClick}
              variant="outline"
              size="sm"
              disabled={isUpdating || isLoading}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
