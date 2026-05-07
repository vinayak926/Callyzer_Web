// ============================================
// LOGIN PAGE — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • bg-page / dark:bg-page-dark full-screen background
//   • Glassmorphic card with backdrop-blur
//   • Gradient CTA button (violet → cyan)
//   • Brand-colored focus rings on inputs
//   • Ambient glow orbs behind card
//   • dark: variant on EVERY element
//   • Hover micro-animations on all interactive elements
// UNCHANGED: All state, logic, API calls, validation
// ============================================

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
        <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-300">

            {/* ── Ambient glow orbs ── */}
            <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[340px] h-[340px] bg-accent/6 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in">

                {/* ── Brand Block ── */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary-soft dark:bg-primary/20 border border-primary-200 dark:border-primary/30 shadow-glow flex items-center justify-center mb-4 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl shadow-lg">
                            📞
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-heading dark:text-heading-dark tracking-tight">Callyzer</h1>
                    <p className="text-sm text-subtle dark:text-subtle-dark mt-1 tracking-wide">Call Management System</p>
                </div>

                {/* ── Login Card ── */}
                <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-7 transition-all duration-300">
                    <h2 className="text-xl font-bold text-heading dark:text-heading-dark tracking-tight">Welcome back</h2>
                    <p className="text-sm text-subtle dark:text-subtle-dark mt-1 mb-6">Sign in to continue to your workspace</p>

                    {/* Error alert */}
                    {error && (
                        <div className="bg-danger-soft dark:bg-danger/10 border border-danger/20 dark:border-danger/20 text-danger rounded-xl px-4 py-3 text-sm mb-5 flex items-start gap-2.5 animate-fade-in">
                            <span className="mt-0.5 shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* ── Email ── */}
                        <div>
                            <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className={`
                                flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200
                                bg-input dark:bg-input-dark border-2
                                ${focusedField === 'email'
                                    ? 'border-primary dark:border-primary-light shadow-glow'
                                    : 'border-line dark:border-line-dark hover:border-line-strong dark:hover:border-line-dark-strong'}
                            `}>
                                <span className="text-subtle dark:text-subtle-dark text-base">✉️</span>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="flex-1 bg-transparent text-heading dark:text-heading-dark text-sm outline-none placeholder-subtle dark:placeholder-subtle-dark"
                                />
                            </div>
                        </div>

                        {/* ── Password ── */}
                        <div>
                            <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className={`
                                flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200
                                bg-input dark:bg-input-dark border-2
                                ${focusedField === 'password'
                                    ? 'border-primary dark:border-primary-light shadow-glow'
                                    : 'border-line dark:border-line-dark hover:border-line-strong dark:hover:border-line-dark-strong'}
                            `}>
                                <span className="text-subtle dark:text-subtle-dark text-base">🔒</span>
                                <input
                                    type={pwdVisible ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="flex-1 bg-transparent text-heading dark:text-heading-dark text-sm outline-none placeholder-subtle dark:placeholder-subtle-dark"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPwdVisible(v => !v)}
                                    className="text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark transition-colors duration-200 cursor-pointer"
                                >
                                    {pwdVisible ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* ── Submit Button ── */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-light hover:to-primary dark:from-primary dark:to-accent dark:hover:from-primary-light dark:hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-elevated hover:shadow-float hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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

                        {/* ── Links ── */}
                        <div className="flex flex-col items-center gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setForgotOpen(true)}
                                className="text-sm text-primary dark:text-primary-light font-semibold hover:text-primary-hover dark:hover:text-primary-200 hover:underline underline-offset-4 flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
                            >
                                🔑 Forgot Password?
                            </button>
                            <div className="w-1 h-1 rounded-full bg-line dark:bg-line-dark" />
                            <Link to="/register" className="text-sm text-subtle dark:text-subtle-dark hover:text-body dark:hover:text-body-dark transition-colors duration-200">
                                New Team Lead? <span className="text-primary dark:text-primary-light font-bold">Register here</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-center gap-2.5 mt-6">
                    <div className="w-1 h-1 rounded-full bg-subtle dark:bg-subtle-dark" />
                    <p className="text-xs text-subtle dark:text-subtle-dark tracking-wide">Secure · Encrypted · Reliable</p>
                    <div className="w-1 h-1 rounded-full bg-subtle dark:bg-subtle-dark" />
                </div>
            </div>

            {/* ── Forgot Password Modal ── */}
            {forgotOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card dark:bg-card-dark/90 dark:backdrop-blur-xl rounded-2xl shadow-float dark:shadow-glow-lg border border-line dark:border-white/5 w-full max-w-sm p-7 relative animate-fade-in transition-colors duration-300">

                        {/* Close button */}
                        <button
                            onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-raised dark:bg-raised-dark hover:bg-hover-bg dark:hover:bg-hover-bg-dark flex items-center justify-center text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark font-bold transition-all duration-200 cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary-soft dark:bg-primary/15 flex items-center justify-center mb-4 text-2xl">
                                ✉️
                            </div>
                            <h3 className="text-xl font-bold text-heading dark:text-heading-dark tracking-tight mb-1">Forgot Password?</h3>
                            <p className="text-sm text-subtle dark:text-subtle-dark mb-5 leading-relaxed">
                                Enter your email address and we'll<br/>send you a reset link.
                            </p>
                        </div>

                        {/* Status message */}
                        {forgotMsg && (
                            <div className={`text-sm rounded-xl px-4 py-3 mb-4 text-center transition-colors duration-200 ${
                                forgotMsg.startsWith('✅')
                                    ? 'bg-success-soft dark:bg-success/10 text-success'
                                    : 'bg-danger-soft dark:bg-danger/10 text-danger'
                            }`}>
                                {forgotMsg}
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={forgotEmail}
                                onChange={e => setForgotEmail(e.target.value)}
                                className="w-full bg-input dark:bg-input-dark border-2 border-line dark:border-line-dark focus:border-primary dark:focus:border-primary-light rounded-xl px-4 py-3 text-sm text-heading dark:text-heading-dark outline-none placeholder-subtle dark:placeholder-subtle-dark transition-all duration-200"
                            />
                            <button
                                type="submit"
                                disabled={forgotLoading}
                                className="w-full bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-accent hover:from-primary-light hover:to-primary disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-float hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                            >
                                {forgotLoading ? 'Sending...' : '📤 Send Reset Link'}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-line dark:bg-line-dark" />
                                <span className="text-xs text-subtle dark:text-subtle-dark font-medium">OR</span>
                                <div className="flex-1 h-px bg-line dark:bg-line-dark" />
                            </div>

                            <button
                                type="button"
                                onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
                                className="w-full py-3 text-sm text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark font-medium transition-colors duration-200 cursor-pointer"
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