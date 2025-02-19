import PaymentStatusCard from '@/components/layouts/paymentStatusCard'

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: {
    cid: string
  }
}) {
  const { cid } = searchParams

  // Fetch the payment status on the server side

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout-session?cid=${cid}`,
      {
        cache: 'no-store', // Ensure fresh data on each request
      },
    )

    const data = await res.json()
    const success = data.status === 'complete' && data.paymentStatus === 'paid'
    const telegramLink = `https://t.me/nodezzbot/start=${cid}`

    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 py-16">
        <PaymentStatusCard
          success={success}
          cid={cid}
          telegramLink={telegramLink}
          amountTotal={data.amountTotal}
          currency={data.currency}
          invoiceUrl={data.url}
          receiptNumber={data.paymentIntent?.paymentReceipt?.receiptNumber}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching payment status:', error)
    // Add error handling UI here
  }
}
