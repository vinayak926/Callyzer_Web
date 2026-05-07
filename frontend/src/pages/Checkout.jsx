import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const fmtPrice = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const planSlug = params.get('plan') || 'starter';
  const cycle = params.get('cycle') || 'monthly';

  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPlans().then((r) => {
      const found = (r.plans || []).find((p) => p.slug === planSlug);
      setPlans(r.plans || []);
      setPlan(found || null);
    });
  }, [planSlug]);

  const handlePay = async () => {
    setError('');
    setProcessing(true);

    try {
      const orderRes = await api.createOrder(planSlug, cycle);

      if (!orderRes.success && !orderRes.orderId) {
        throw new Error(orderRes.message || 'Could not create order');
      }

      if (window.Razorpay && !orderRes.orderId.startsWith('order_mock_')) {
        const rzp = new window.Razorpay({
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: 'INR',
          name: 'Callyzer',
          description: `${orderRes.planName} — ${cycle}`,
          order_id: orderRes.orderId,
          handler: async (response) => {
            const verifyRes = await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planSlug,
              billingCycle: cycle,
            });

            if (verifyRes.success) {
              navigate('/business/subscription?welcome=1');
            } else {
              setError(verifyRes.message || 'Payment verification failed');
            }
          },
          prefill: {},
          theme: { color: '#4A68F0' },
        });

        rzp.open();
      } else {
        const verifyRes = await api.verifyPayment({
          razorpayOrderId: orderRes.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_sig',
          planSlug,
          billingCycle: cycle,
        });

        if (verifyRes.success) {
          navigate('/business/subscription?welcome=1');
        } else {
          setError(verifyRes.message || 'Error');
        }
      }
    } catch (e) {
      setError(e.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const amount = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const gst = Math.round(amount * 0.18);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
            <h2 className="text-xl font-bold text-white">Complete Your Purchase</h2>
            <p className="text-indigo-200 text-sm mt-1">Secure payment via Razorpay</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
                📦
              </div>
              <div>
                <p className="font-bold text-gray-900">{plan.name} Plan</p>
                <p className="text-sm text-gray-500 capitalize">
                  {cycle} billing · {plan.maxUsers} users
                </p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
              {[
                ['Subtotal', fmtPrice(amount)],
                ['GST (18%)', fmtPrice(gst)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-4 py-3 text-sm text-gray-600">
                  <span>{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}

              <div className="flex justify-between px-4 py-3 font-bold text-gray-900">
                <span>Total</span>
                <span>{fmtPrice(amount + gst)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                ❌ {error}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-base"
            >
              {processing ? 'Processing...' : `Pay ${fmtPrice(amount + gst)}`}
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              ← Back to pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}