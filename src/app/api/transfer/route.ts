'use server'

import { NextRequest, NextResponse } from 'next/server'
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import bs58 from 'bs58'
import { db } from '@/db'
import {
  completed_orders,
  claimed_rewards,
} from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { calculateClaimableRewardsByOrder } from '@/lib/CalculateRewards'

// Constants
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!
const ORE_MINT = new PublicKey(process.env.NEXT_PUBLIC_ORE_MINT_ADDRESS!)
const RPC_URL = process.env.RPC_URL || ''

// Debug logger
const debugLog = (message: string, data?: any) => {
  console.log('\n---DEBUG LOG---')
  console.log('Message:', message)
  if (data) {
    console.log('Data:', data)
  }
  console.log('-------------\n')
}

// Add this new helper function
async function confirmTransaction(
  connection: Connection,
  signature: string,
  blockhash: string,
  lastValidBlockHeight: number
) {
  const start = Date.now();
  const timeout = 60000; // 60 second timeout

  while (Date.now() - start < timeout) {
    const response = await connection.getSignatureStatus(signature);
    const status = response.value;

    if (status) {
      if (status.err) {
        throw new Error(`Transaction failed: ${status.err}`);
      }
      
      if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
        return true;
      }
    }

    // Wait for 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Transaction confirmation timeout');
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await request.json()
    const { recipientAddress, orderId } = body

    if (!recipientAddress || !orderId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
        },
        { status: 400 },
      )
    }

    // 2. Validate order and ownership
    const order = await db.query.completed_orders.findFirst({
      where: and(
        eq(completed_orders.id, orderId),
        eq(completed_orders.payment_status, 'finished'),
        eq(completed_orders.name, 'Ore'), // Ensure it's an Ore node
      ),
    })

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found or unauthorized',
        },
        { status: 404 },
      )
    }

    // 3. Calculate claimable rewards
    const { claimableAmount } = await calculateClaimableRewardsByOrder(order)

    if (claimableAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No rewards available to claim',
        },
        { status: 400 },
      )
    }

    // 4. Setup connection and admin wallet
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    })

    const adminKeypair = Keypair.fromSecretKey(bs58.decode(ADMIN_PRIVATE_KEY))

    // 5. Setup token accounts
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      ORE_MINT,
      adminKeypair.publicKey,
      true,
      'confirmed',
    )

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      ORE_MINT,
      new PublicKey(recipientAddress),
      true,
      'confirmed',
    )
    debugLog('Recipient token account ready', {
      address: toTokenAccount.address.toString(),
    })

    // 5. Check balance
    const transferAmount = Math.floor(claimableAmount * 10 ** 6) // Using 9 decimals for ORE token
    if (Number(fromTokenAccount.amount) < transferAmount) {
      debugLog('Insufficient balance', {
        available: fromTokenAccount.amount.toString(),
        required: transferAmount.toString(),
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient balance',
        },
        { status: 400 },
      )
    } else {
      debugLog('Sufficient balance', {
        available: fromTokenAccount.amount.toString(),
        required: transferAmount.toString(),
      })
    }

    // 6. Create and send transaction
    debugLog('Creating transfer instruction')
    const transferIx = createTransferInstruction(
      fromTokenAccount.address,
      toTokenAccount.address,
      adminKeypair.publicKey,
      transferAmount,
      [],
      TOKEN_PROGRAM_ID,
    )

    debugLog('Getting recent blockhash')
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash('confirmed')

    const messagev0 = new TransactionMessage({
      payerKey: adminKeypair.publicKey,
      recentBlockhash: blockhash,
      instructions: [transferIx],
    }).compileToV0Message()

    const transaction = new VersionedTransaction(messagev0)
    transaction.sign([adminKeypair])

    debugLog('Sending transaction')
    const txId = await connection.sendTransaction(transaction)

    // Replace the existing confirmation code with this:
    debugLog('Awaiting confirmation', { txId });
    await confirmTransaction(connection, txId, blockhash, lastValidBlockHeight);

    // 7. Record the claim
    const db_insert_response = await db.insert(claimed_rewards).values({
      transaction_hash: txId,
      wallet_address: recipientAddress,
      user_id: order.user_id,
      node_id: order.node_id,
      order_id: orderId,
      token_amount: claimableAmount,
    })
    debugLog('Claim recorded', {
      db_insert_response,
    })

    return NextResponse.json({
      success: true,
      data: {
        txId,
        claimedAmount: claimableAmount,
        // remainingRewards: 0, // Since we're claiming all available rewards
        explorerUrl: `https://explorer.solana.com/tx/${txId}`,
      },
    })
  } catch (error) {
    debugLog('ERROR', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed',
      },
      { status: 500 },
    )
  }
}
