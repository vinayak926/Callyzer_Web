import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pwdVisible, setPwdVisible] = useState(false);
    const navigate = useNavigate();

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const validate = () => {
        if (!form.name.trim()) return 'Full name is required.';
        if (!form.email.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email.';
        if (!form.phone.trim()) return 'Phone number is required.';
        if (!/^\d{10}$/.test(form.phone.trim())) return 'Enter a valid 10-digit phone number.';
        if (!form.password) return 'Password is required.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setLoading(true);
        try {
            const data = await api.register({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                password: form.password,
            });
            if (data.status === 'pending' || data.message?.toLowerCase().includes('pending')) {
                navigate('/pending');
            } else if (data.message?.toLowerCase().includes('already')) {
                setError('This email is already registered. Please login.');
            } else {
                setError(data.message || 'Registration failed. Try again.');
            }
        } catch {
            setError('Unable to connect. Check your network.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', icon: '👤', type: 'text' },
        { key: 'email', label: 'Email Address', placeholder: 'you@company.com', icon: '✉️', type: 'email' },
        { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', icon: '📱', type: 'tel' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-indigo-200">📞</div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Callyzer</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Register as Team Lead</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Create Account</h2>
                    <p className="text-gray-500 text-sm mb-5">Your account will be reviewed by admin before activation.</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">{f.icon}</span>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => set(f.key, e.target.value)}
                                        placeholder={f.placeholder}
                                        maxLength={f.key === 'phone' ? 10 : undefined}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Password */}
                        {['password', 'confirmPassword'].map((key, i) => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    {i === 0 ? 'Password' : 'Confirm Password'}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔒</span>
                                    <input
                                        type={pwdVisible ? 'text' : 'password'}
                                        value={form[key]}
                                        onChange={e => set(key, e.target.value)}
                                        placeholder={i === 0 ? 'Min. 6 characters' : 'Re-enter password'}
                                        className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    />
                                    {i === 0 && (
                                        <button type="button" onClick={() => setPwdVisible(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {pwdVisible ? '🙈' : '👁️'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Info Box */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-2 text-sm text-indigo-700">
                            <span className="shrink-0">ℹ️</span>
                            <p>After registration, Super Admin will review and approve your account before you can login.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Account'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}