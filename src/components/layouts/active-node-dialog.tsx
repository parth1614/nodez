'use client'
import { FarcasterIdField } from '@/components/FarcasterIdField'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowUpRightFromSquare, Calendar, LineChart, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { calculateClaimableRewardsByOrder } from '@/lib/CalculateRewards'
import { Button } from '@/components/ui/button'
import type { ActiveNode } from '@/utils/types'
import { ClaimButton } from '@/components/layouts/deploy-button'
import { toast } from 'sonner'
import { WalletAddressField } from '@/components/WalletAddressField'

export default function ActiveNodeDialog({
  children,
  activeNode,
}: Readonly<{
  children: React.ReactNode
  activeNode: ActiveNode
}>) {
  const node = activeNode.nodes!
  const isFarcaster = node.name === 'Farcaster'
  const [accruedReward, setAccruedReward] = useState(0)
  const [perNodeReward, setPerNodeReward] = useState(0)
  const [claimedReward, setClaimedReward] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [claimState, setClaimState] = useState<
    'initial' | 'loading' | 'success'
  >('initial')

  useEffect(() => {
    if (
      node.rewards &&
      node.rewards > 0 &&
      activeNode.completed_orders?.created_at
    ) {
      calculateClaimableRewardsByOrder(activeNode.completed_orders!).then(
        (response) => {
          console.log(response)
          setAccruedReward(response.totalAccrued)
          setPerNodeReward(response.perNodeReward)
          setClaimedReward(response.alreadyClaimed)
          setIsExpired(response.isExpired)
        },
      )
    }
  }, [activeNode])

  const handleClaim = async () => {
    if (!walletAddress) {
      toast.error('Please enter a wallet address!')
      return
    }

    setClaimState('loading')

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientAddress: walletAddress,
          orderId: activeNode.completed_orders?.id,
        }),
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Claim failed')
      }

      toast.success(
        `Successfully claimed ${result.data.claimedAmount.toFixed(6)} ORE`,
      )
    } catch (error) {
      console.error('Claim error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to claim rewards',
      )
      setClaimState('initial')
    } finally {
      setClaimState('success')
    }
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="gap-y-2 rounded-3xl border-none bg-primary/10 pt-2 backdrop-blur-sm sm:rounded-3xl md:rounded-3xl lg:rounded-3xl">
        <div className="absolute right-4 top-4 flex items-center gap-x-3 justify-self-end">
          <DialogClose asChild>
            <Button
              variant={'outline'}
              className="aspect-square rounded-full p-1 ring-primary/20 hover:bg-primary/10"
            >
              <X size={16} className="text-primary" />
            </Button>
          </DialogClose>
        </div>
        <DialogHeader className="flex-row items-center justify-start gap-8 px-0 py-2">
          <Image src={node.logo} alt="Image" width={64} height={64} />
          <div className="space-y-2 pb-2">
            <DialogTitle className="text-2xl">{node.name}</DialogTitle>
            <DialogDescription>{node.type}</DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1">
          <Card className="bg-primary-foreground text-primary">
            <CardHeader className="flex flex-row items-center justify-center gap-2 p-2">
              <CardDescription className="text-lg">
                Deployed Quantity :
              </CardDescription>
              <CardTitle className="text-2xl">
                {activeNode.completed_orders?.quantity}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4 py-2">
          <Card className="bg-primary-foreground text-primary">
            <CardHeader className="p-3">
              <CardDescription>Purchased on</CardDescription>
              <CardTitle className="text-2xl">
                <Calendar size={24} className="mr-2 inline" />
                {activeNode.completed_orders?.created_at?.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-primary-foreground text-primary">
            <CardHeader className="p-3">
              <CardDescription>Active till</CardDescription>
              <CardTitle className="text-2xl">
                <Calendar size={24} className="mr-2 inline" />
                {activeNode.completed_orders?.expiry_date?.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        {node.rewards && node.rewards > 0 && (
          <div className="grid grid-cols-1 gap-4 py-2">
            <Card className="gap-0 bg-primary-foreground text-primary">
              <CardHeader className="p-3">
                <CardDescription>Total Accrued Reward</CardDescription>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-2xl">
                    &asymp; {accruedReward.toFixed(10)}
                  </CardTitle>
                  <CardTitle className="text-2xl">{node.currency}</CardTitle>
                </div>
              </CardHeader>
              {activeNode.completed_orders?.quantity &&
                activeNode.completed_orders?.quantity > 1 && (
                  <CardHeader className="p-3">
                    <CardDescription>Per Node Reward</CardDescription>
                    <div className="flex flex-row items-center gap-2">
                      <CardTitle className="text-2xl">
                        &asymp; {perNodeReward.toFixed(10)}
                      </CardTitle>
                      <CardTitle className="text-2xl">
                        {node.currency}
                      </CardTitle>
                    </div>
                  </CardHeader>
                )}
              <CardHeader className="p-3">
                <CardDescription>Claimed Reward</CardDescription>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-2xl">
                    &asymp; {claimedReward.toFixed(10)}
                  </CardTitle>
                  <CardTitle className="text-2xl">{node.currency}</CardTitle>
                </div>
              </CardHeader>
              <CardHeader className="p-3">
                <CardDescription>Status</CardDescription>
                <CardTitle className="text-2xl">
                  {isExpired ? 'Expired' : 'Active'}
                </CardTitle>
              </CardHeader>
            </Card>

            <WalletAddressField
              order={activeNode.completed_orders!}
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />

            <DialogFooter>
              {node.rewards > 0 ? (
                <ClaimButton handleClaim={handleClaim} />
              ) : (
                <Button
                  variant={'secondary'}
                  className="w-full rounded-full py-6 text-lg font-semibold"
                  disabled
                >
                  Claimed
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
        {isFarcaster && (
          <>
            <div className="grid grid-cols-1 gap-4 py-2">
              <FarcasterIdField
                orderId={activeNode.completed_orders?.id ?? ''}
              />
            </div>
            <DialogFooter>
              <Button
                disabled
                className="w-full rounded-full py-6 text-lg font-semibold hover:underline"
                onClick={() => {
                  window.open('https://demo.nodez.tech', '_blank')
                }}
              >
                <LineChart size={24} className="mr-2" />
                View Analytics
                <ArrowUpRightFromSquare size={16} className="ml-2" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
