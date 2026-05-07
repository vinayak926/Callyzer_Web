import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [loading, setLoading]       = useState(false);
    const [pwdVisible, setPwdVisible] = useState(false);
    const [error, setError]           = useState('');
    const [focusedField, setFocusedField] = useState(null);

    // Forgot Password
    const [forgotOpen, setForgotOpen]       = useState(false);
    const [forgotEmail, setForgotEmail]     = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMsg, setForgotMsg]         = useState('');

    const { login } = useContext(AuthContext);
    const navigate  = useNavigate();

    const validate = () => {
        const t = email.trim(), p = password.trim();
        if (!t) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'Please enter a valid email address.';
        if (!p) return 'Password is required.';
        if (p.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setLoading(true);
        try {
            const data = await api.login(email.trim(), password.trim());
            if (data.token) {
                const validRoles = ['super_admin', 'business_user', 'salesperson'];
                if (!validRoles.includes(data.user?.role)) {
                    setError('Access denied. You do not have permission to use this portal.');
                    return;
                }
                login(data.token, data.user);
                const role = data.user.role;
                if      (role === 'super_admin')   navigate('/admin/dashboard');
                else if (role === 'business_user') navigate('/business/dashboard');
                else                               navigate('/salesperson/dashboard');
            } else if (data.status === 'pending') {
                navigate('/pending');
            } else if (data.status === 'rejected') {
                setError('Your account registration was rejected. Please contact the admin.');
            } else {
                setError(data.message || 'Invalid email or password.');
            }
        } catch {
            setError('Unable to connect to the server. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) { setForgotMsg('Please enter your email.'); return; }
        setForgotLoading(true);
        setForgotMsg('');
        try {
            await api.forgotPassword(forgotEmail.trim());
            setForgotMsg('✅ Password reset link has been sent to your email.');
        } catch {
            setForgotMsg('❌ Unable to send reset email. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                {/* Brand Block */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-100 border border-indigo-200 shadow flex items-center justify-center mb-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-3xl">
                            📞
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Callyzer</h1>
                    <p className="text-sm text-gray-500 mt-1">Call Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <h2 className="text-xl font-extrabold text-gray-900">Welcome back</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Sign in to continue to your workspace</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Email Address
                            </label>
                            <div className={`flex items-center gap-2 bg-gray-50 border-2 rounded-xl px-3 py-3 transition-colors ${focusedField === 'email' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                <span className="text-base">✉️</span>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                Password
                            </label>
                            <div className={`flex items-center gap-2 bg-gray-50 border-2 rounded-xl px-3 py-3 transition-colors ${focusedField === 'password' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                <span className="text-base">🔒</span>
                                <input
                                    type={pwdVisible ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400"
                                />
                                <button type="button" onClick={() => setPwdVisible(v => !v)} className="text-gray-400 hover:text-gray-600">
                                    {pwdVisible ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        {/* Links */}
                        <div className="flex flex-col items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setForgotOpen(true)}
                                className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                            >
                                🔑 Forgot Password?
                            </button>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <Link to="/register" className="text-sm text-gray-500 hover:text-gray-700">
                                New Team Lead? <span className="text-indigo-600 font-bold">Register here</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    <p className="text-xs text-gray-400 tracking-wide">Secure · Encrypted · Reliable</p>
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm p-7 relative">
                        <button
                            onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-3xl">
                                ✉️
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Forgot Password?</h3>
                            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                                Enter your email address and we'll<br/>send you a reset link.
                            </p>
                        </div>

                        {forgotMsg && (
                            <div className={`text-sm rounded-xl px-4 py-3 mb-4 text-center ${forgotMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {forgotMsg}
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={forgotEmail}
                                onChange={e => setForgotEmail(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none placeholder-gray-400 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={forgotLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {forgotLoading ? 'Sending...' : '📤 Send Reset Link'}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400">OR</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <button
                                type="button"
                                onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
                                className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}