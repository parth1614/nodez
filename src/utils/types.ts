import { SelectNode, SelectCompletedOrder, PaymentStatus, SelectUser } from '@/db/schema'

export interface ActiveNode {
  nodes: SelectNode | null
  completed_orders: SelectCompletedOrder | null
}

export type PaymentWebhookBody = {
  actually_paid: number
  actually_paid_at_fiat: number
  fee: {
    currency: string
    depositFee: number
    serviceFee: number
    withdrawalFee: number
  }
  invoice_id: number
  order_id: string
  order_description: string
  outcome_amount: number
  outcome_currency: string
  parent_payment_id: number | null
  pay_address: string
  pay_amount: number
  pay_currency: string
  payin_extra_id: number | null
  payment_extra_ids: number[] | null
  payment_id: number
  payment_status: PaymentStatus
  purchase_id: string
  updated_at: number
  price_amount: number
  price_currency: string
}

export type PaymentBody = {
  payment_amount: number
  payment_status: PaymentStatus
  user_id: string
  node_id: string
  order_id: string
  quantity: number
  duration: string
}

export type ActiveNodeResult = {
  nodes: SelectNode | null
  users: SelectUser | null
  completed_orders: {
    id: string
    wallet_address: string
    created_at: Date
    updated_at: Date
    name: string
    type: string
    logo: string
    slots: number
    price: number
    documentation_url: string
    rewards: number | null
    currency: string | null
    user_id: string
    amount: number
    quantity: number
    expiry_date: Date | null
    payment_status: string
    node_id: string
    order_id: string | null
    payment_id: string | null
  }
}

export interface CopperXInvoiceResponse {
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

// interface Node {
//   id: string
//   type: string
//   name: string
//   logo: string
//   docs_url: string
//   slots: number
//   price: number
//   rewards: number | null
//   currency: string | null
// }

// interface User {
//   id: string
//   walletAddress: string
//   createdAt: Date
//   updatedAt: Date
// }

// interface CompletedOrder {
//   id: string
//   wallet_address: string
//   created_at: Date
//   updated_at: Date
//   name: string
//   type: string
//   logo: string
//   slots: number
//   price: number
//   documentation_url: string
//   rewards: number | null
//   currency: string | null
//   user_id: string
//   amount: number
//   quantity: number
//   expiry_date: Date | null
//   payment_status: string
//   node_id: string
//   order_id: string
//   payment_id: string | null
// }
