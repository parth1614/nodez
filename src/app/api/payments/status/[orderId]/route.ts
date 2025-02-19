import { db } from '@/db'
import { completed_orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const orderId = params.orderId
    const order = await db
      .select()
      .from(completed_orders)
      .where(eq(completed_orders.order_id, orderId))
      .limit(1)

    if (!order[0] || order.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: order[0].payment_status === 'paid',
      orderId: order[0].order_id,
      amount: order[0].amount,
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
