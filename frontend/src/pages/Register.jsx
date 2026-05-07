// ============================================
// REGISTER PAGE — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • bg-page / dark:bg-page-dark background with ambient glow
//   • Glassmorphic card (dark mode)
//   • Gradient CTA button with hover lift
//   • Refined inputs with icon + focus glow
//   • Info box using accent color tones
//   • dark: variant on EVERY element
// UNCHANGED: All state, logic, API calls, validation, navigation
// ============================================

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
        <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

            {/* ── Ambient glow orbs ── */}
            <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/4 w-[320px] h-[320px] bg-accent/6 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in">

                {/* ── Brand ── */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-glow">
                        📞
                    </div>
                    <h1 className="text-2xl font-extrabold text-heading dark:text-heading-dark tracking-tight">Callyzer</h1>
                    <p className="text-subtle dark:text-subtle-dark text-sm mt-0.5 tracking-wide">Register as Team Lead</p>
                </div>

                {/* ── Card ── */}
                <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-7 transition-all duration-300">
                    <h2 className="text-lg font-bold text-heading dark:text-heading-dark tracking-tight mb-1">Create Account</h2>
                    <p className="text-subtle dark:text-subtle-dark text-sm mb-5">Your account will be reviewed by admin before activation.</p>

                    {/* Error */}
                    {error && (
                        <div className="bg-danger-soft dark:bg-danger/10 border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2.5 animate-fade-in">
                            <span className="mt-0.5 shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* ── Dynamic text fields ── */}
                        {fields.map(f => (
                            <div key={f.key}>
                                <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
                                    {f.label}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-60">{f.icon}</span>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => set(f.key, e.target.value)}
                                        placeholder={f.placeholder}
                                        maxLength={f.key === 'phone' ? 10 : undefined}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-line dark:border-line-dark rounded-xl bg-input dark:bg-input-dark text-sm text-heading dark:text-heading-dark placeholder-subtle dark:placeholder-subtle-dark focus:outline-none focus:border-primary dark:focus:border-primary-light focus:shadow-glow hover:border-line-strong dark:hover:border-line-dark-strong transition-all duration-200"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* ── Password fields ── */}
                        {['password', 'confirmPassword'].map((key, i) => (
                            <div key={key}>
                                <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
                                    {i === 0 ? 'Password' : 'Confirm Password'}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-60">🔒</span>
                                    <input
                                        type={pwdVisible ? 'text' : 'password'}
                                        value={form[key]}
                                        onChange={e => set(key, e.target.value)}
                                        placeholder={i === 0 ? 'Min. 6 characters' : 'Re-enter password'}
                                        className="w-full pl-11 pr-12 py-3 border-2 border-line dark:border-line-dark rounded-xl bg-input dark:bg-input-dark text-sm text-heading dark:text-heading-dark placeholder-subtle dark:placeholder-subtle-dark focus:outline-none focus:border-primary dark:focus:border-primary-light focus:shadow-glow hover:border-line-strong dark:hover:border-line-dark-strong transition-all duration-200"
                                    />
                                    {i === 0 && (
                                        <button type="button" onClick={() => setPwdVisible(v => !v)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark transition-colors duration-200 cursor-pointer">
                                            {pwdVisible ? '🙈' : '👁️'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* ── Info Box ── */}
                        <div className="bg-accent-soft dark:bg-accent/10 border border-accent/15 dark:border-accent/20 rounded-xl p-3.5 flex gap-2.5 text-sm text-accent-hover dark:text-accent-light">
                            <span className="shrink-0 mt-0.5">ℹ️</span>
                            <p>After registration, Super Admin will review and approve your account before you can login.</p>
                        </div>

                        {/* ── Submit ── */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-accent hover:from-primary-light hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-elevated hover:shadow-float hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Account'}
                        </button>

                        {/* ── Login link ── */}
                        <p className="text-center text-sm text-subtle dark:text-subtle-dark">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary dark:text-primary-light font-bold hover:text-primary-hover dark:hover:text-primary-200 hover:underline underline-offset-4 transition-colors duration-200">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}