'use client'
// import { getInvoice } from '@/app/actions/invoice'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculatePriceWithNode } from '@/utils/pricing'
import { ExternalLink, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { Button } from '../ui/button'
import { DeployButton } from './deploy-button'
import type { Node } from './node-card'
import { useUser } from '@/Context/UserContext'

const PLAN_OPTIONS = ['1 month', '2 months', '3 months'] as const
type PlanOption = (typeof PLAN_OPTIONS)[number]

export default function DeployDialog({
  children,
  node,
}: Readonly<{ children: React.ReactNode; node: Node }>) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>('1 month')
  const [quantity, setQuantity] = useState<number>(1)
  const router = useRouter()
  const { address: walletAddress } = useAccount()
  const { user } = useUser()

  const price = useMemo(
    () => calculatePriceWithNode(node.name, selectedPlan, quantity),
    [selectedPlan, quantity],
  )

  const handleDeploy = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first!')
      return
    }

    try {
      // const user = await getUser({ address: walletAddress })
      if (!user?.id) {
        toast.error('User not found! Please try again.')
        return
      }

      const order_id = crypto.randomUUID()
      toast.promise(
        // getInvoice({
        //   order_id,
        //   node_id: node.id,
        //   plan: selectedPlan,
        //   userId: user.id,
        //   price,
        //   quantity,
        //   duration: selectedPlan.split(' ')[0]!,
        // }),
        fetch('/api/create-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id,
            node_id: node.id,
            plan: selectedPlan,
            userId: user.id,
            price: calculatePriceWithNode(node.name, selectedPlan, quantity),
            quantity,
            duration: selectedPlan.split(' ')[0],
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("Invoice Url:", data.url);
          if (!data.url) {
            throw new Error('Failed to create order');
          }
          router.push(data.url);
          return 'Redirecting to payment gateway...';
        }),
        {
          loading: 'Creating your order...',
          success: (message) => message,
          error: 'Failed to create order',
        },
      )
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    }
  }

  const renderPlanOptions = () => (
    <TabsList className="mb-4 w-full rounded-full bg-primary-foreground/50 p-1">
      {PLAN_OPTIONS.map((period) => (
        <TabsTrigger
          key={period}
          className="rounded-full py-3 data-[state=active]:bg-primary/20"
          value={period}
          onClick={() => setSelectedPlan(period)}
        >
          {period}
        </TabsTrigger>
      ))}
    </TabsList>
  )

  const renderPlanContent = (period: PlanOption) => {
    const monthCount = parseInt(period.split(' ')[0]!, 10)
    const monthlyFee = price / (monthCount * quantity)

    return (
      <TabsContent
        key={period}
        value={period}
        tabIndex={-1}
        className="space-y-3 rounded-3xl bg-primary-foreground/50 px-8 py-6"
      >
        <div className="flex justify-between">
          <span className="text-muted-foreground">Node fee</span>
          <span className="ml-auto">${monthlyFee.toFixed(2)} /month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Period</span>
          <span>{period}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Quantity</span>
          <div className="flex items-center space-x-2">
            <Button
              className="grid size-6 place-items-center rounded-full bg-primary/20 p-0 text-primary hover:bg-primary/50"
              disabled={quantity === 1}
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button
              disabled={quantity === 9}
              className="grid size-6 place-items-center rounded-full bg-primary/20 p-0 text-primary hover:bg-primary/50"
              onClick={() => setQuantity((prev) => Math.min(9, prev + 1))}
            >
              +
            </Button>
          </div>
        </div>
        <hr className="my-2 h-0.5 bg-primary/50" />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span>${price.toFixed(2)}</span>
        </div>
      </TabsContent>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-y-2 rounded-3xl border-none bg-primary/10 pt-2 backdrop-blur-sm sm:rounded-3xl md:rounded-3xl lg:rounded-3xl">
        <div className="absolute right-4 top-4 flex items-center gap-x-3 justify-self-end">
          {node.slots ? (
            <Button
              tabIndex={-1}
              className="cursor-default items-center gap-x-2 rounded-full bg-neutral-500/20 text-primary hover:bg-neutral-500/20"
            >
              <span>Slots</span>
              <strong className="text-xl font-semibold">{node.slots}</strong>
            </Button>
          ) : null}
          <DialogClose asChild>
            <Button
              variant={'outline'}
              className="aspect-square rounded-full p-1 ring-primary/20 hover:bg-primary/10"
            >
              <X size={16} className="text-primary" />
            </Button>
          </DialogClose>
        </div>
        <DialogHeader className="flex-row items-end gap-4 px-0 py-2">
          <Image src={node.logo} alt="Image" width={64} height={64} />
          <div className="space-y-2 pb-2">
            <DialogTitle className="text-2xl">{node.name}</DialogTitle>
            <div className="space-x-2">
              <DialogDescription className="flex flex-col">
                <span>{node.type}</span>
                {node.docs_url && (
                  <Link
                    href={node.docs_url}
                    className="flex flex-row items-center"
                    target="_blank"
                  >
                    <span className="italic underline">docs</span>
                    <ExternalLink className="pl-0.5" size={12} />
                  </Link>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="1 month" className="w-full">
          {renderPlanOptions()}
          {PLAN_OPTIONS.map(renderPlanContent)}
        </Tabs>
        {/* Conditional Rendering of Estimated Reward */}
        {node.rewards && node.rewards > 0 && (
          <div className="text-md flex flex-col gap-2 rounded-3xl bg-primary-foreground px-6 py-4 text-muted-foreground">
            <div className="flex flex-col gap-2 bg-primary-foreground">
              <span className="text-md text-muted-foreground">
                Estimated Reward
              </span>
              <div className="flex flex-row items-center justify-start gap-2">
                <span className="text-2xl font-semibold leading-none tracking-tight text-primary">
                  &asymp; {node.rewards}
                </span>
                <span className="text-2xl font-semibold leading-none tracking-tight text-primary">
                  {node.currency}
                </span>
              </div>
            </div>
            {/* <span className="text-sm text-yellow-400">&#9733; Refreshes in every 24 hours</span> */}
          </div>
        )}
        <DialogFooter>
          {node.slots >= 1 ? (
            <DeployButton nodeId={node.id} handleDeploy={handleDeploy} />
          ) : (
            <Button
              variant={'secondary'}
              className="w-full rounded-full py-6 text-lg font-semibold"
              disabled
            >
              Sold out
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
