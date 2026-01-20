'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export function PhonePeButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = async (amount: number) => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Add PhonePe payment integration logic here
      alert(`Initiating PhonePe payment of ₹${amount}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={() => initiatePayment(amount)} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${amount} with PhonePe`}
      </Button>
      {error && <p className="text-destructive mt-2">{error}</p>}
    </div>
  )
}
