import { completed_orders, nodes } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import type { PaymentWebhookBody } from '@/utils/types'

// Handle the POST request for the webhook callback
export async function POST(request: Request) {
  try {
    // Parse the incoming webhook data
    const data: PaymentWebhookBody = await request.json()
    console.log('Received webhook data:', data)

    await db.transaction(async (tx) => {
      console.log('Starting database transaction')

      // Fetch the order by order_id
      const orderToUpdate = await tx
        .select()
        .from(completed_orders)
        .where(eq(completed_orders.order_id, data.order_id))
        .limit(1)

      if (!orderToUpdate || orderToUpdate.length === 0) {
        console.log('Order not found for id:', data.order_id)
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Fetch the associated node by node_id
      const nodeToUpdate = await tx
        .select()
        .from(nodes)
        .where(eq(nodes.id, orderToUpdate[0]!.node_id))
        .limit(1)

      if (!nodeToUpdate || nodeToUpdate.length === 0) {
        console.log('Node not found for id:', orderToUpdate[0]!.node_id)
        return NextResponse.json({ error: 'Node not found' }, { status: 404 })
      }

      // Update the node slots
      const updatedSlots = nodeToUpdate[0]!.slots - orderToUpdate[0]!.quantity
      await tx
        .update(nodes)
        .set({ slots: updatedSlots })
        .where(eq(nodes.id, orderToUpdate[0]!.node_id))

      console.log('Node updated successfully, slots:', updatedSlots)

      // Update the order details with the received payment data
      await tx
        .update(completed_orders)
        .set({
          amount: data.price_amount ?? 0,
          user_id: orderToUpdate[0]!.user_id,
          payment_status: data.payment_status ?? 'pending',
          node_id: orderToUpdate[0]!.node_id,
          payment_id: data.payment_id.toString(),
          quantity: orderToUpdate[0]!.quantity ?? 1,
        })
        .where(eq(completed_orders.order_id, data.order_id))

      console.log('Order updated successfully')
    })

    // Return a success response
    return NextResponse.json(
      { message: 'Transaction completed successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in POST request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
