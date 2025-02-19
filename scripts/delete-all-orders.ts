import { db } from '@/db'
import { orders } from '@/db/schema'

export const deleteAllOrders = async () => {
  await db.delete(orders)
  console.log('All orders deleted')
}
