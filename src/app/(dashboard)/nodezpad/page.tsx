'use client'
import { getActiveNodes } from '@/app/actions/nodes'
import NodePadCard from '@/components/layouts/nodezpad-card'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { SelectNode, SelectUser } from '@/db/schema'
import { ActiveNodeResult } from '@/utils/types'

export default function NodezPadPage() {
  const { address } = useAccount()
  const router = useRouter()
  const [activeNodes, setActiveNodes] = useState<any[]>([])

  const hardcodedWalletAddress = '0x8692183315e7233f88a534596aED139a5614b197' // Replace with the actual hardcoded wallet address

  useEffect(() => {
    if (address) {
      const fetchActiveNodes = async () => {
        const nodes = await getActiveNodes(address)
        if (nodes) {
          setActiveNodes(nodes)
        }
      }
      fetchActiveNodes()
    }
  }, [address])

  const handleOpenForm = () => {
    router.push('/nodezpad/nodeform')
  }

  return (
    <section className="flex-1">
      <section className="grid gap-6 py-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full flex items-center justify-center">
          <h2 className="text-3xl font-semibold text-primary/50">
            Coming Soon !
          </h2>
        </div>
      </section>
    </section>
    // <section className="flex-1">
    //   <section className="grid gap-6 py-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    //     <div className="col-span-full flex items-center justify-between">
    //       <div className="flex items-center gap-4">
    //         <h2 className="text-3xl font-semibold text-primary">What Do You Get ?</h2>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         {address === hardcodedWalletAddress && (
    //           <Button
    //             variant={"ghost"}
    //             className="rounded-md border border-primary/40 px-8 py-5 hover:bg-primary-foreground text-md font-semibold"
    //             onClick={handleOpenForm}
    //           >
    //             Open To Fill Node Form
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //     {activeNodes?.map((activeNode) => (
    //       <Link key={activeNode.nodes!.id} href={`/nodezpad/${activeNode.nodes!.id}`}>
    //         <NodePadCard
    //           node={activeNode.nodes!}
    //           purchased
    //           className="cursor-pointer"
    //         />
    //       </Link>
    //     ))}
    //   </section>
    // </section>
  )
}
