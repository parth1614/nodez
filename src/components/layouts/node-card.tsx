import { nodes } from '@/db/schema'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '../ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import DeployDialog from './deploy-dialog'

export type Node = typeof nodes.$inferSelect

export default function NodeCard({
  node,
  purchased,
  className,
}: {
  node: Node
  purchased?: boolean
  className?: string
}) {
  return (
    <Card
      className={cn(
        'relative w-full cursor-default rounded-3xl border-2 bg-foreground/5 duration-200 hover:border-primary/20 hover:bg-primary/5',
        className,
      )}
    >
      {!purchased && node.slots > 0 && (
        // pulsing animation for slots when purchase is live
        <div className="absolute right-4 top-4 self-end">
          <div className="absolute -left-2 -top-2 h-7 w-7 animate-pulse rounded-full bg-primary/50 blur-lg"></div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary"></div>
        </div>
      )}
      <CardHeader className="flex-row items-center gap-4 p-3">
        {/* the purchased node on the active nodes page */}
        <Image src={node.logo} alt="Image" width={80} height={80} />
        <div className="space-y-2">
          <CardTitle>{node.name}</CardTitle>
          <CardDescription>{node.type}</CardDescription>
        </div>
      </CardHeader>
      {!purchased && (
        // show this on dashboard page for purchasing nodes
        <CardFooter className="m-3 flex-row items-center justify-between rounded-full bg-primary/5 p-2 px-2">
          <span className="px-3 font-semibold text-primary">
            {node.slots <= 0 ? 'Sold Out' : 'Slots'}
          </span>
          <div className="flex items-center gap-3">
            <strong className="text-xl font-semibold">
              {node.slots <= 0 ? '' : node.slots}
            </strong>
            <DeployDialog node={node}>
              <Button
                variant={'ghost'}
                className="rounded-full border border-primary/40 px-8 py-5 hover:bg-primary-foreground"
              >
                {node.slots <= 0 ? 'View Plans' : 'Deploy'}
              </Button>
            </DeployDialog>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
