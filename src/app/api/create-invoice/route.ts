'use server'

import { NextResponse } from 'next/server'
import axios from 'axios'
import type { CopperXInvoiceResponse } from '@/utils/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, node_id, plan, price, userId, quantity, duration } = body

    // First API call to init payment
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/init`, {
      payment_amount: price,
      payment_status: 'pending',
      user_id: userId,
      node_id,
      order_id,
      quantity,
      duration,
    })

    // API call to CopperX to create the invoice
    const response = await axios.post<CopperXInvoiceResponse>(
      `${process.env.COPPERX_API_URL}/api/v1/checkout/sessions`,
      {
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=true&cid={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payments?success=false&cid={CHECKOUT_SESSION_ID}`,
        ipnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
        lineItems: {
          data: [
            {
              priceData: {
                currency: 'usdt',
                unitAmount: price * 1000000, // Convert to the smallest unit
                productData: {
                  name: plan,
                  description:
                    'For early stage projects who are getting started',
                },
              },
              quantity: 1,
            },
          ],
        },
        paymentSetting: {
          allowSwap: false,
        },
        metadata: {
          node_id,
          plan,
          quantity,
          duration,
          order_id,
        },
      },
      {
        headers: {
          //   Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    const { data } = response
    console.log('Invoice created:', data)
    console.log('Invoice URL:', data.url)

    // Return the response
    return NextResponse.json({
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      mode: 'payment',
      paymentMethodTypes: data.paymentMethodTypes,
      paymentSetting: data.paymentSetting,
      expiresAt: data.expiresAt,
      amountTotal: data.amountTotal,
      currency: data.currency,
      status: data.status,
      paymentStatus: data.paymentStatus,
      successUrl: data.successUrl,
      url: data.url,
      lineItems: data.lineItems,
    })
  } catch (error) {
    console.error('Error creating invoice:', error)

    // Using NextResponse instead of res for error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error creating invoice', error: error.message },
        { status: 500 },
      )
    } else {
      return NextResponse.json(
        { message: 'Error creating invoice', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
