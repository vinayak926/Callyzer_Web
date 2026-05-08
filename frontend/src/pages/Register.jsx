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

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { api } from '../services/api';

// export default function Register() {
//     const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [pwdVisible, setPwdVisible] = useState(false);
//     const navigate = useNavigate();

//     const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

//     const validate = () => {
//         if (!form.name.trim()) return 'Full name is required.';
//         if (!form.email.trim()) return 'Email is required.';
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email.';
//         if (!form.phone.trim()) return 'Phone number is required.';
//         if (!/^\d{10}$/.test(form.phone.trim())) return 'Enter a valid 10-digit phone number.';
//         if (!form.password) return 'Password is required.';
//         if (form.password.length < 6) return 'Password must be at least 6 characters.';
//         if (form.password !== form.confirmPassword) return 'Passwords do not match.';
//         return null;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const err = validate();
//         if (err) { setError(err); return; }
//         setError('');
//         setLoading(true);
//         try {
//             const data = await api.register({
//                 name: form.name.trim(),
//                 email: form.email.trim(),
//                 phone: form.phone.trim(),
//                 password: form.password,
//             });
//             if (data.status === 'pending' || data.message?.toLowerCase().includes('pending')) {
//                 navigate('/pending');
//             } else if (data.message?.toLowerCase().includes('already')) {
//                 setError('This email is already registered. Please login.');
//             } else {
//                 setError(data.message || 'Registration failed. Try again.');
//             }
//         } catch {
//             setError('Unable to connect. Check your network.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fields = [
//         { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', icon: '👤', type: 'text' },
//         { key: 'email', label: 'Email Address', placeholder: 'you@company.com', icon: '✉️', type: 'email' },
//         { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', icon: '📱', type: 'tel' },
//     ];

//     return (
//         <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

//             {/* ── Ambient glow orbs ── */}
//             <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
//             <div className="absolute bottom-1/3 left-1/4 w-[320px] h-[320px] bg-accent/6 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

//             <div className="w-full max-w-md relative z-10 animate-fade-in">

//                 {/* ── Brand ── */}
//                 <div className="text-center mb-6">
//                     <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-glow">
//                         📞
//                     </div>
//                     <h1 className="text-2xl font-extrabold text-heading dark:text-heading-dark tracking-tight">Callyzer</h1>
//                     <p className="text-subtle dark:text-subtle-dark text-sm mt-0.5 tracking-wide">Register as Team Lead</p>
//                 </div>

//                 {/* ── Card ── */}
//                 <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-7 transition-all duration-300">
//                     <h2 className="text-lg font-bold text-heading dark:text-heading-dark tracking-tight mb-1">Create Account</h2>
//                     <p className="text-subtle dark:text-subtle-dark text-sm mb-5">Your account will be reviewed by admin before activation.</p>

//                     {/* Error */}
//                     {error && (
//                         <div className="bg-danger-soft dark:bg-danger/10 border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2.5 animate-fade-in">
//                             <span className="mt-0.5 shrink-0">⚠️</span>
//                             <span>{error}</span>
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-4">

//                         {/* ── Dynamic text fields ── */}
//                         {fields.map(f => (
//                             <div key={f.key}>
//                                 <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
//                                     {f.label}
//                                 </label>
//                                 <div className="relative">
//                                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-60">{f.icon}</span>
//                                     <input
//                                         type={f.type}
//                                         value={form[f.key]}
//                                         onChange={e => set(f.key, e.target.value)}
//                                         placeholder={f.placeholder}
//                                         maxLength={f.key === 'phone' ? 10 : undefined}
//                                         className="w-full pl-11 pr-4 py-3 border-2 border-line dark:border-line-dark rounded-xl bg-input dark:bg-input-dark text-sm text-heading dark:text-heading-dark placeholder-subtle dark:placeholder-subtle-dark focus:outline-none focus:border-primary dark:focus:border-primary-light focus:shadow-glow hover:border-line-strong dark:hover:border-line-dark-strong transition-all duration-200"
//                                     />
//                                 </div>
//                             </div>
//                         ))}

//                         {/* ── Password fields ── */}
//                         {['password', 'confirmPassword'].map((key, i) => (
//                             <div key={key}>
//                                 <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
//                                     {i === 0 ? 'Password' : 'Confirm Password'}
//                                 </label>
//                                 <div className="relative">
//                                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-60">🔒</span>
//                                     <input
//                                         type={pwdVisible ? 'text' : 'password'}
//                                         value={form[key]}
//                                         onChange={e => set(key, e.target.value)}
//                                         placeholder={i === 0 ? 'Min. 6 characters' : 'Re-enter password'}
//                                         className="w-full pl-11 pr-12 py-3 border-2 border-line dark:border-line-dark rounded-xl bg-input dark:bg-input-dark text-sm text-heading dark:text-heading-dark placeholder-subtle dark:placeholder-subtle-dark focus:outline-none focus:border-primary dark:focus:border-primary-light focus:shadow-glow hover:border-line-strong dark:hover:border-line-dark-strong transition-all duration-200"
//                                     />
//                                     {i === 0 && (
//                                         <button type="button" onClick={() => setPwdVisible(v => !v)}
//                                             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark transition-colors duration-200 cursor-pointer">
//                                             {pwdVisible ? '🙈' : '👁️'}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}

//                         {/* ── Info Box ── */}
//                         <div className="bg-accent-soft dark:bg-accent/10 border border-accent/15 dark:border-accent/20 rounded-xl p-3.5 flex gap-2.5 text-sm text-accent-hover dark:text-accent-light">
//                             <span className="shrink-0 mt-0.5">ℹ️</span>
//                             <p>After registration, Super Admin will review and approve your account before you can login.</p>
//                         </div>

//                         {/* ── Submit ── */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-accent hover:from-primary-light hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-elevated hover:shadow-float hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer"
//                         >
//                             {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Account'}
//                         </button>

//                         {/* ── Login link ── */}
//                         <p className="text-center text-sm text-subtle dark:text-subtle-dark">
//                             Already have an account?{' '}
//                             <Link to="/login" className="text-primary dark:text-primary-light font-bold hover:text-primary-hover dark:hover:text-primary-200 hover:underline underline-offset-4 transition-colors duration-200">Sign In</Link>
//                         </p>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Mail, Phone, Lock, Eye, EyeOff, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Button, Input, Alert } from '../components/UI';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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

    const getFieldError = (field) => {
        if (!form[field] && field !== 'confirmPassword') return '';
        if (field === 'email' && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            return 'Invalid email format';
        if (field === 'phone' && form.phone && !/^\d{10}$/.test(form.phone.trim()))
            return 'Must be 10 digits';
        if (field === 'confirmPassword' && form.confirmPassword && form.password !== form.confirmPassword)
            return 'Passwords do not match';
        return '';
    };

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6) s++;
        if (p.length >= 10) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };

    const strength = passwordStrength();
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
    const strengthColor = ['', '#F43F5E', '#F59E0B', '#3B82F6', '#10B981', '#10B981'][strength];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[42%] bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-blue-600/10" />
                <div className="absolute bottom-[10%] left-[-40px] w-[200px] h-[200px] rounded-full bg-cyan-500/10" />

                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <PhoneCall size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-xl">Callyzer</span>
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                        Join Callyzer as a<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Team Lead
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Register your business account and get access to powerful call analytics for your entire team.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: CheckCircle2, text: 'Manage and track your entire sales team' },
                            { icon: CheckCircle2, text: 'Monitor call performance in real-time' },
                            { icon: CheckCircle2, text: 'Export reports and analyze trends' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <Icon size={18} className="text-blue-400 shrink-0" />
                                    <p className="text-slate-300 text-sm">{item.text}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400">⚡ Your account will be reviewed by the Super Admin before activation. This typically takes a few hours.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-500">Trusted by 2,400+ sales professionals</p>
                </div>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-y-auto">
                <div className="lg:hidden flex items-center gap-2.5 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <PhoneCall size={16} className="text-white" />
                    </div>
                    <span className="text-slate-900 font-bold text-lg">Callyzer</span>
                </div>

                <div className="w-full max-w-[420px]">
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                        <p className="text-slate-500 mt-1.5 text-sm">Register as a Team Lead to manage your sales team</p>
                    </div>

                    {error && (
                        <div className="mb-5">
                            <Alert type="error">{error}</Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            icon={User}
                            autoComplete="name"
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={e => { set('email', e.target.value); setError(''); }}
                            icon={Mail}
                            error={getFieldError('email')}
                            autoComplete="email"
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={form.phone}
                            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            icon={Phone}
                            error={getFieldError('phone')}
                            autoComplete="tel"
                        />

                        <div>
                            <Input
                                label="Password"
                                type={showPwd ? 'text' : 'password'}
                                placeholder="Minimum 6 characters"
                                value={form.password}
                                onChange={e => set('password', e.target.value)}
                                icon={Lock}
                                iconRight={showPwd ? EyeOff : Eye}
                                onIconRightClick={() => setShowPwd(v => !v)}
                                autoComplete="new-password"
                            />
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{ backgroundColor: i <= strength ? strengthColor : '#E2E8F0' }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs mt-1 font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Confirm Password"
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={e => set('confirmPassword', e.target.value)}
                            icon={Lock}
                            iconRight={showConfirm ? EyeOff : Eye}
                            onIconRightClick={() => setShowConfirm(v => !v)}
                            error={getFieldError('confirmPassword')}
                            autoComplete="new-password"
                        />

                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-500 leading-snug">
                                I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span> and <span className="text-blue-600 font-semibold">Privacy Policy</span>
                            </span>
                        </label>

                        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}