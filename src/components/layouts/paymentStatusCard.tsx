'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, Copy, ExternalLink, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Helper function to format currency
const formatCurrency = (amount: number, currency: string) => {
  const value = amount / 1000000 // Convert from smallest unit (e.g., 21990000 -> 21.99)
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface PaymentStatusCardProps {
  success: boolean
  cid: string
  telegramLink: string
  amountTotal: number
  currency: string
  invoiceUrl?: string // New prop for invoice URL
  receiptNumber?: string // New prop for receipt number
}

export default function PaymentStatusCard({
  success,
  cid,
  telegramLink,
  amountTotal,
  currency,
  invoiceUrl,
  receiptNumber,
}: PaymentStatusCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(cid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedAmount = formatCurrency(amountTotal, currency)

  return (
    <Card className="w-full max-w-md border-none bg-primary/10 backdrop-blur-sm sm:rounded-3xl">
      <CardHeader className="flex flex-col items-center gap-2">
        {success ? (
          <CheckCircle className="h-12 w-12 text-green-500" />
        ) : (
          <XCircle className="h-12 w-12 text-red-500" />
        )}
        <CardTitle className="text-2xl font-semibold">
          {success ? 'Payment Successful' : 'Payment Pending'}
        </CardTitle>
        {receiptNumber && (
          <span className="text-sm text-muted-foreground">
            Receipt: {receiptNumber}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <CardDescription className="text-balance text-center text-base">
          {success
            ? `Your payment of ${formattedAmount} ${currency.toUpperCase()} was successful.`
            : 'Your payment is being processed. Please wait a moment.'}
        </CardDescription>

        {success && (
          <>
            {/* Invoice URL Button */}
            {invoiceUrl && (
              <Button variant="outline" className="w-full" asChild>
                <Link
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Invoice
                </Link>
              </Button>
            )}

            {/* Order ID Section 
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between w-full bg-white/95 rounded-lg border px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Order ID</span>
                  <span className="text-sm font-medium text-black">{cid}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-black hover:bg-black/90"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            */}
            {/* Telegram Section */}
            <div className="w-full space-y-2">
              <span className="text-sm text-center block text-primary">
                Join our Telegram group for support
              </span>
              <Button
                asChild
                className="w-full rounded-full py-6 text-base font-semibold"
              >
                <Link
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Telegram Group
                </Link>
              </Button>
            </div>
          </>
        )}

        <Button asChild variant="link" className="mt-2">
          <Link href="/">Back to home</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
