import { db } from '@/db'
import { orders } from '@/db/schema'
import type { PaymentBody } from '@/utils/types'

export const POST = async (request: Request) => {
  try {
    const data: PaymentBody = await request.json()
    if (!data) {
      return new Response('error', { status: 400 })
    }
    await db.insert(orders).values({
      amount: data?.payment_amount,
      userId: data?.user_id,
      nodeId: data?.node_id,
      payment_status: data?.payment_status,
      orderId: data?.order_id,
      quantity: data?.quantity,
      expiryDate: new Date(
        new Date().getTime() +
          Number(data?.duration) * 30 * 24 * 60 * 60 * 1000,
      ),
    })
    return new Response('ok', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('error', { status: 500 })
  }
}
