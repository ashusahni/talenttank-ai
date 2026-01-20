'use client';
import { usePhonePePayment } from '@/app/_hooks/usePhonePePayment';
import { Button } from '@/components/ui/button';

export default function PaymentButton({ amount }: { amount: number }) {
  const { initiatePayment, loading, error } = usePhonePePayment();

  return (
    <div>
      <Button onClick={() => initiatePayment(amount)} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
