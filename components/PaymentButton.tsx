'use client';
// TEMPORARY: Commented out due to missing usePhonePePayment hook
// import { usePhonePePayment } from '@/app/_hooks/usePhonePePayment';
import { Button } from '@/components/ui/button';

export default function PaymentButton({ amount }: { amount: number }) {
  // const { initiatePayment, loading, error } = usePhonePePayment();

  return (
    <div>
      <Button onClick={() => console.log('Payment clicked:', amount)} disabled={false}>
        {`Pay ₹${amount}`}
      </Button>
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
    </div>
  );
}
