'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentResult() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setStatus('ERROR');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const resp = await axios.get(`/api/phonepe/status/${orderId}`);
        setStatus(resp.data.state ?? 'ERROR');
      } catch {
        setStatus('ERROR');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!orderId) return <p>Invalid request</p>;
  if (loading) return <p>Loading payment status…</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-2xl font-bold">Payment {status}</h1>
      <p>Order ID: {orderId}</p>
      {status === 'COMPLETED' && <p>🎉 Thank you for your payment!</p>}
      {status === 'PENDING' && <p>Your payment is pending. We will notify you soon.</p>}
      {(status === 'FAILED' || status === 'ERROR') && <p>Payment failed. Please try again.</p>}

      <button
        onClick={() => router.push('/')}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
