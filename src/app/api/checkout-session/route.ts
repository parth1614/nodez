'use server'

import { NextResponse } from 'next/server'
import axios from 'axios'

interface CopperXSessionResponse {
  id: string
  url: string
  status: string
  expiresAt: string
  amountTotal: string
  currency: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  mode: string
  paymentMethodTypes: string[]
  paymentSetting: {
    allowedChains: { chainId: number }[]
    paymentMethodTypes: string[]
  }
  successUrl: string
  lineItems: {
    data: {
      priceData: {
        currency: string
        unitAmount: number
        productData: {
          name: string
          description: string
        }
      }
      quantity: number
    }[]
  }
}

// Using the new App Router convention with dynamic route parameters
export async function GET(request: Request) {
  try {
    // Get the URL to extract search params
    const { searchParams } = new URL(request.url)
    const cid = searchParams.get('cid')

    if (!cid) {
      return NextResponse.json(
        { message: 'cid parameter is required' },
        { status: 400 },
      )
    }

    console.log('Fetching Copperx session with cid:', cid)

    const { data } = await axios.get<CopperXSessionResponse>(
      `${process.env.COPPERX_API_URL}/api/v1/checkout/sessions/${cid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.COPPERX_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    console.log('Copperx session fetched successfully:', data)

    // Return the session data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching checkout session:', error)

    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      return NextResponse.json(
        {
          message: 'Error fetching checkout session',
          error: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 },
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error fetching checkout session', error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: 'Error fetching checkout session', error: 'Unknown error' },
      { status: 500 },
    )
  }
}
