'use server'

import { db } from '@/db'
import {
  completed_orders,
  nodes,
  orders,
  users,
} from '@/db/schema'
import { and, eq } from 'drizzle-orm'

// const getUser = async ({ address }: { address: string }) => {
//   try {
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.walletAddress, address))
//       .limit(1)

//     return user[0]
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// }

const getUserOrdersWithNodes = async (walletAddress: string) => {
  return await db
    .select({
      orders,
      nodes,
    })
    .from(users)
    .innerJoin(orders, eq(users.id, orders.userId))
    .innerJoin(nodes, eq(nodes.id, orders.nodeId))
    .where(
      and(
        eq(users.walletAddress, walletAddress),
        eq(orders.payment_status, 'finished'),
      ),
    )
}

export const migrateUserIdByWalletAddresss = async (
  walletAddress: string,
  newUserId: string,
) => {
  try {
    console.log('Starting migration for:', {
      walletAddress,
      newUserId,
    })
    const finishedOrders = await getUserOrdersWithNodes(walletAddress)
    console.log('Found finished orders:', finishedOrders.length)
    // check for wallet address in completed orders table
    const completedOrders = await db
      .select()
      .from(completed_orders)
      .where(eq(completed_orders.wallet_address, walletAddress))

    console.log('Found completed orders:', completedOrders.length)
    if (completedOrders.length > 0) {
      console.log('Completed orders found, skipping migration')
      return {
        success: true,
        message: 'Completed orders found, skipping migration',
        completedOrdersCount: completedOrders.length,
      }
    }

    // Bulk insert into completed_orders
    if (finishedOrders.length > 0) {
      await db.insert(completed_orders).values(
        finishedOrders.map((order) => ({
          wallet_address: walletAddress,
          created_at: order.orders.createdAt,
          updated_at: order.orders.updatedAt,
          name: order.nodes.name,
          type: order.nodes.type,
          logo: order.nodes.logo,
          slots: order.nodes.slots,
          price: order.nodes.price,
          documentation_url: order.nodes.docs_url,
          rewards: order.nodes.rewards,
          currency: order.nodes.currency,
          user_id: newUserId, // Supabase auth user ID
          amount: order.orders.amount,
          quantity: order.orders.quantity,
          expiry_date: order.orders.expiryDate,
          payment_status: order.orders.payment_status,
          node_id: order.nodes.id,
          order_id: order.orders.orderId,
          payment_id: order.orders.paymentId,
        })),
      )

      console.log('Migration completed successfully')
      return {
        success: true,
        message: 'Orders migrated successfully',
        completedOrdersCount: finishedOrders.length,
      }
    }

    return {
      success: true,
      message: 'No orders found',
      completedOrdersCount: 0,
    }
  } catch (error) {
    console.error('Error in migrateUserIdByWalletAddresss:', error)
    return { success: false, error: (error as Error).message }
  }
}
