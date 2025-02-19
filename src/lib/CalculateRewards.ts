'use server'

import { db } from '@/db'
import { sql, eq } from 'drizzle-orm'
import { claimed_rewards, SelectCompletedOrder } from '@/db/schema'

interface Reward {
  perNodeReward: number
  totalAccuredReward: number
}

export const calculateAccureddReward = (
  node: string,
  purchaseDate: Date,
  quantity: number,
): Reward => {
  if (!purchaseDate) return { totalAccuredReward: 0, perNodeReward: 0 }
  switch (node) {
    case 'Ore':
      const dailyReward = 3.201e-8 * 1152
      const today = new Date()
      const totalDays = Math.floor(
        (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24),
      )
      const perNodeReward = totalDays * dailyReward
      const totalAccuredReward = perNodeReward * quantity

      return { perNodeReward, totalAccuredReward }
    default:
      return { totalAccuredReward: 0, perNodeReward: 0 }
  }
}

// Helper function to calculate claimable rewards
export async function calculateClaimableRewardsByOrder(
  order: SelectCompletedOrder,
) {
  const purchaseDate = order.created_at
  const expiryDate = order.expiry_date || new Date() // Use current date if no expiry
  const now = new Date()
  const isExpired = now > expiryDate

  // Use the earlier of now or expiry date
  const endDate = isExpired ? expiryDate : now

  // Calculate days since purchase
  const daysSincePurchase = Math.floor(
    (endDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  // Daily reward rate for Ore nodes (3.201e-8 * 1152 per day)
  // new formula for rewards is 21.5 ore / 32 users for 1 month
  const dailyRewardRate = (21.5 / 32) / 30
  const totalPossibleRewards =
    daysSincePurchase * dailyRewardRate * order.quantity

  // 3. Get total claimed rewards
  const claimedResult = await db
    .select({
      totalClaimed: sql<number>`COALESCE(SUM(token_amount), 0)`,
    })
    .from(claimed_rewards)
    .where(eq(claimed_rewards.order_id, order.id))

  const totalClaimed = claimedResult[0]?.totalClaimed || 0

  // 4. Calculate claimable amount
  const claimableAmount = Math.max(0, totalPossibleRewards - totalClaimed)

  return {
    claimableAmount,
    perNodeReward: totalPossibleRewards / order.quantity,
    totalAccrued: totalPossibleRewards,
    alreadyClaimed: totalClaimed,
    isExpired,
  }
}
