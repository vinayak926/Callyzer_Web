import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const fmtPrice = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block mr-2 flex-shrink-0">
      <circle cx="8" cy="8" r="8" fill="#22c55e" fillOpacity="0.15" />
      <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PLAN_COLORS = {
  starter: { border: '#6366f1', badge: '#ede9fe', badgeText: '#4f46e5', glow: 'rgba(99,102,241,0.12)' },
  growth: { border: '#0ea5e9', badge: '#e0f2fe', badgeText: '#0369a1', glow: 'rgba(14,165,233,0.12)' },
  pro: { border: '#f59e0b', badge: '#fef3c7', badgeText: '#b45309', glow: 'rgba(245,158,11,0.12)' },
};

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getPlans().then((r) => {
      setPlans(r.plans || []);
      setLoading(false);
    });
  }, []);

  const handleStartTrial = async (plan) => {
    setStarting(plan.slug);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/register');
        return;
      }
      const res = await api.startTrial(plan.slug);
      if (res.success) {
        navigate('/business/subscription?welcome=1');
      } else {
        alert(res.message || 'Error starting trial');
      }
    } catch {
      alert('Server error. Please try again.');
    } finally {
      setStarting('');
    }
  };

  const handleBuyNow = (plan) => {
    navigate(`/checkout?plan=${plan.slug}&cycle=${billing}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-16 px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
          Simple Pricing
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Plans for every team size
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Start free for 14 days — no credit card required
        </p>

        <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          {['monthly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBilling(cycle)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billing === cycle
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {cycle === 'yearly' ? 'Yearly (save 20%)' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const colors = PLAN_COLORS[plan.slug] || PLAN_COLORS.starter;
          const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const isPopular = plan.slug === 'growth';

          return (
            <div
              key={plan._id}
              className="bg-white rounded-2xl border-2 p-6 flex flex-col relative shadow-sm hover:shadow-md transition-shadow"
              style={{
                borderColor: isPopular ? colors.border : '#e5e7eb',
                boxShadow: isPopular ? `0 0 0 4px ${colors.glow}` : undefined,
              }}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: colors.badge, color: colors.badgeText }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">Up to {plan.maxUsers} users</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {fmtPrice(price)}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  /{billing === 'yearly' ? 'year' : 'month'}
                </span>
                {billing === 'yearly' && (
                  <p className="text-green-600 text-xs font-semibold mt-1">
                    Save {fmtPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {(plan.features || []).map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <button
                  onClick={() => handleBuyNow(plan)}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: isPopular
                      ? `linear-gradient(135deg, ${colors.border}, ${colors.border}cc)`
                      : '#f1f5f9',
                    color: isPopular ? '#fff' : '#374151',
                  }}
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleStartTrial(plan)}
                  disabled={starting === plan.slug}
                  className="w-full py-2 rounded-xl font-medium text-sm text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {starting === plan.slug
                    ? 'Starting...'
                    : `Start ${plan.trialDays}-day Free Trial`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 text-center">
        {[
          { icon: '🔒', title: 'Secure Payments', sub: 'Powered by Razorpay' },
          { icon: '🔄', title: 'Cancel Anytime', sub: 'No lock-in contracts' },
          { icon: '📞', title: 'Support Included', sub: 'Email & chat support' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
            <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}