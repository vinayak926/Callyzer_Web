import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const fmtPrice = (p) => (p ? `₹${(p / 100).toLocaleString('en-IN')}` : '—');

const STATUS_STYLES = {
  active: { bg: '#dcfce7', color: '#15803d', label: 'Active' },
  trialing: { bg: '#dbeafe', color: '#1d4ed8', label: 'Trial' },
  past_due: { bg: '#fef3c7', color: '#b45309', label: 'Past Due' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
  expired: { bg: '#f1f5f9', color: '#64748b', label: 'Expired' },
};

export default function Subscription() {
  const [sub, setSub] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isWelcome = params.get('welcome') === '1';

  useEffect(() => {
    Promise.allSettled([api.getMySubscription(), api.getMyInvoices()]).then(
      ([subRes, invRes]) => {
        if (subRes.status === 'fulfilled')
          setSub(subRes.value.subscription);
        if (invRes.status === 'fulfilled')
          setInvoices(invRes.value.invoices || []);
        setLoading(false);
      }
    );
  }, []);

  const handleCancel = async () => {
    if (
      !window.confirm(
        'Cancel subscription? You can use features until period end.'
      )
    )
      return;

    setCancelling(true);
    const res = await api.cancelSubscription();
    if (res.success) setSub((s) => ({ ...s, status: 'cancelled' }));
    setCancelling(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const statusStyle = STATUS_STYLES[sub?.status] || STATUS_STYLES.expired;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {isWelcome && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-green-800">Welcome to Callyzer!</p>
            <p className="text-green-700 text-sm">
              Your subscription is active. Enjoy the platform.
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          Subscription
        </h2>
        <p className="text-gray-500 text-sm">
          Manage your plan and billing
        </p>
      </div>

      {!sub ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold text-gray-800 mb-2">
            No active subscription
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Start a free trial or purchase a plan
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View Plans →
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {sub.plan?.name || 'Unknown'} Plan
                </h3>
                <p className="text-sm text-gray-500 capitalize mt-0.5">
                  {sub.billingCycle} billing
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                }}
              >
                {statusStyle.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                ['Period Start', fmtDate(sub.currentPeriodStart)],
                ['Period End', fmtDate(sub.currentPeriodEnd)],
                sub.status === 'trialing'
                  ? ['Trial Ends', fmtDate(sub.trialEndsAt)]
                  : ['Last Payment', fmtPrice(sub.lastPaymentAmount)],
                ['Max Users', sub.plan?.maxUsers || '—'],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {val}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/pricing')}
                className="flex-1 py-2.5 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Upgrade Plan
              </button>

              {['active', 'trialing'].includes(sub.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>

          {invoices.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">
                  Billing History
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center gap-4 px-5 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {inv.planName} · {fmtDate(inv.issuedAt)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">
                      {fmtPrice(inv.totalAmount)}
                    </p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}