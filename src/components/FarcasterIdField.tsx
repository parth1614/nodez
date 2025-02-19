'use client'

import {
  getFarcasterFormData,
  updateFarcasterID,
} from '@/app/actions/nodes'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface FarcasterIdFieldProps {
  orderId: string
}

export function FarcasterIdField({ orderId }: FarcasterIdFieldProps) {
  const [fid, setFid] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchFarcasterID = async () => {
      const result = await getFarcasterFormData(orderId)
      if (result.success) {
        setFid(result.farcasterID ?? '')
      } else {
        console.error('Error fetching Farcaster ID:', result.error)
        toast.error('Failed to fetch Farcaster ID. Please try again.')
      }
    }

    fetchFarcasterID()
  }, [orderId])

  const handleFidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true)
    setFid(e.target.value)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    if (!fid.trim()) {
      toast.error('Please enter a valid Farcaster ID')
      return
    }
    setIsUpdating(true)
    try {
      const result = await updateFarcasterID(orderId, fid)
      if (result.success) {
        setIsEditing(false)
        toast.success('Farcaster ID updated successfully')
      } else {
        toast.error(result.error ?? 'Failed to update Farcaster ID')
      }
    } catch (error) {
      console.error('Error updating Farcaster ID:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="bg-primary-foreground text-primary">
      <CardHeader className="p-3">
        <CardDescription>Farcaster ID</CardDescription>
        <div className="flex items-center gap-2">
          <Input
            value={fid}
            onChange={handleFidChange}
            disabled={!isEditing}
            placeholder="Enter your Farcaster ID"
            className="flex-grow"
          />
          {!isEditing ? (
            <Button onClick={handleEditClick} variant="outline" size="sm">
              Edit
            </Button>
          ) : (
            <Button
              onClick={handleSaveClick}
              variant="outline"
              size="sm"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
