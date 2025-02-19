'use client'

import { useEffect, useState } from 'react'

import { getActiveNodes } from '@/app/actions/nodes'

import ActiveNodeDialog from '@/components/layouts/active-node-dialog'
import BannerDialog from '@/components/banner'
import NodeCard from '@/components/layouts/node-card'

import { ActiveNode } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'

import { Loader2 } from 'lucide-react'
import { User } from '@supabase/supabase-js'

export default function ActiveNodesPage() {
  const supabase = createClient()
  const [activeNodes, setActiveNodes] = useState<ActiveNode[]>([])
  const [isFetchingNodes, setIsFetchingNodes] = useState(true)
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

  useEffect(() => {
    const fetchActiveNodes = async () => {
      if (user?.id) {
        setIsFetchingNodes(true)
        try {
          const nodes = await getActiveNodes(user.id)
          if (nodes) {
            setActiveNodes(nodes as ActiveNode[])
          }
        } finally {
          setIsFetchingNodes(false)
        }
      }
    }

    fetchActiveNodes()
  }, [user])

  return (
    <section className="flex-1">
      <BannerDialog />
      <section className="grid gap-6 py-4 md:grid-cols-2 lg:grid-cols-3">
        {isFetchingNodes ? (
          <LoaderComponent />
        ) : activeNodes && activeNodes.length > 0 ? (
          activeNodes.map((activeNode) => (
            <ActiveNodeDialog
              key={activeNode.completed_orders?.id}
              activeNode={activeNode}
            >
              {activeNode.nodes && (
                <NodeCard
                  node={activeNode.nodes}
                  purchased
                  className="cursor-pointer"
                />
              )}
            </ActiveNodeDialog>
          ))
        ) : (
          <h3>No Active Nodes Purchased Yet!</h3>
        )}
      </section>
    </section>
  )
}

function LoaderComponent() {
  return (
    <div className="col-span-full flex justify-center items-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{'  '}Loading Nodes</span>
    </div>
  )
}
