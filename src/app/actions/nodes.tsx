'use server'

import { db } from '@/db'
import { completed_orders, nodes, nodeForms } from '@/db/schema'
import { ActiveNode } from '@/utils/types'
import { and, desc, eq, sql } from 'drizzle-orm'

export async function getActiveNodes(user_id: string): Promise<ActiveNode[]> {
  try {
    // await deleteAllOrders();
    // await createDummyOrders(address, 5);
    const activeNodes = await db
      .select()
      .from(completed_orders)
      .leftJoin(nodes, eq(completed_orders.node_id, nodes.id))
      // .leftJoin(users, eq(completed_orders.user_id, users.id))
      .where(
        and(
          // eq(nodes.name, "Farcaster"),
          eq(completed_orders.payment_status, 'finished'),
          eq(completed_orders.user_id, user_id),
        ),
      )
    return activeNodes as ActiveNode[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getNodes() {
  try {
    const nodesToShow = await db.select().from(nodes).orderBy(desc(nodes.slots))
    // console.log(nodesToShow);
    return nodesToShow
  } catch (error) {
    console.error(error)
    return []
  }
}


export async function updateFarcasterID(orderId: string, fid: string) {
  try {
    // Attempt to update the existing record
    const updateResult = await db
      .update(nodeForms)
      .set({
        formData: sql`jsonb_set(COALESCE("form_data"::jsonb, '{}'::jsonb), '{farcasterID}', ${fid}::jsonb)`,
      })
      .where(eq(nodeForms.orderId, orderId))
      .returning({ updatedId: nodeForms.id })

    // If no record was updated, insert a new one
    if (updateResult.length === 0) {
      const insertResult = await db
        .insert(nodeForms)
        .values({
          orderId: orderId,
          formData: { farcasterID: fid },
        })
        .returning({ updatedId: nodeForms.id })

      return {
        success: true,
        updatedId: insertResult[0]?.updatedId,
        action: 'inserted',
      }
    }

    return {
      success: true,
      updatedId: updateResult[0]?.updatedId,
      action: 'updated',
    }
  } catch (error) {
    console.error('Error upserting Farcaster ID:', error)
    return { success: false, error: 'Failed to upsert Farcaster ID' }
  }
}

export async function getFarcasterFormData(orderId: string) {
  try {
    const result = await db
      .select({ formData: nodeForms.formData })
      .from(nodeForms)
      .where(eq(nodeForms.orderId, orderId))
      .limit(1)

    if (result.length === 0) {
      return {
        success: false,
        error: 'No form data found for the given order ID',
      }
    }

    const formData = result[0]?.formData as { farcasterID?: string }
    const farcasterID = formData?.farcasterID

    if (!farcasterID) {
      return { success: false, error: 'Farcaster ID not found in form data' }
    }

    return { success: true, farcasterID }
  } catch (error) {
    console.error('Error retrieving Farcaster form data:', error)
    return { success: false, error: 'Failed to retrieve Farcaster form data' }
  }
}

export async function updateWalletAddress(orderId: string, walletAddress: string) {
  try {
    const result = await db
      .update(nodeForms)
      .set({
        formData: sql`jsonb_set(COALESCE("form_data"::jsonb, '{}'::jsonb), '{walletAddress}', ${JSON.stringify(walletAddress)}::jsonb)`,
      })
      .where(eq(nodeForms.orderId, orderId))
      .returning({ updatedId: nodeForms.id })

    if (result.length === 0) {
      // If no record was updated, insert a new one
      const insertResult = await db
        .insert(nodeForms)
        .values({
          orderId: orderId,
          formData: { walletAddress },
        })
        .returning({ updatedId: nodeForms.id })

      return {
        success: true,
        updatedId: insertResult[0]?.updatedId,
        action: 'inserted',
      }
    }

    return {
      success: true,
      updatedId: result[0]?.updatedId,
      action: 'updated',
    }
  } catch (error) {
    console.error('Error upserting wallet address:', error)
    return { success: false, error: 'Failed to upsert wallet address' }
  }
}

export async function getWalletFormData(orderId: string) {
  try {
    const result = await db
      .select({ formData: nodeForms.formData })
      .from(nodeForms)
      .where(eq(nodeForms.orderId, orderId))
      .limit(1)

    if (result.length === 0) {
      return {
        success: false,
        error: 'No form data found for the given order ID',
      }
    }

    const formData = result[0]?.formData as { walletAddress?: string }
    const walletAddress = formData?.walletAddress

    if (!walletAddress) {
      return { success: false, error: 'Wallet address not found in form data' }
    }

    return { success: true, walletAddress }
  } catch (error) {
    console.error('Error retrieving wallet form data:', error)
    return { success: false, error: 'Failed to retrieve wallet form data' }
  }
}
