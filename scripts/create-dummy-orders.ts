import { db } from '@/db'
import { nodes, orders, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const createDummyOrders = async (address: string, count: number = 1) => {
  const node = await db.select().from(nodes).where(eq(nodes.name, 'Farcaster'))
  const dummyOrders = Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    amount: 49.99,
    quantity: 1,
    payment_status: 'finished',
    nodeId: node[0]?.id!,
    orderId: crypto.randomUUID(),
    paymentId: Math.floor(Math.random() * 1000000000).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    duration: '1',
  }))

  const user = await db
    .select()
    .from(users)
    .where(eq(users.walletAddress, address))
  try {
    await db.insert(orders).values(
      dummyOrders.map((order) => ({
        ...order,
        userId: user[0]?.id!,
        amount: order.amount,
        expiryDate: new Date(
          new Date().getTime() +
            Number(order.duration) * 30 * 24 * 60 * 60 * 1000,
        ),
      })),
    )
    console.log(
      `${count} dummy order(s) created for user ${user[0]?.walletAddress}`,
    )
  } catch (error) {
    console.error('Error creating dummy orders:', error)
  }
}
