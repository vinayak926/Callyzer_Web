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

// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { api } from '../services/api';

// export default function Login() {
//     const [email, setEmail]           = useState('');
//     const [password, setPassword]     = useState('');
//     const [loading, setLoading]       = useState(false);
//     const [pwdVisible, setPwdVisible] = useState(false);
//     const [error, setError]           = useState('');
//     const [focusedField, setFocusedField] = useState(null);

//     // Forgot Password
//     const [forgotOpen, setForgotOpen]       = useState(false);
//     const [forgotEmail, setForgotEmail]     = useState('');
//     const [forgotLoading, setForgotLoading] = useState(false);
//     const [forgotMsg, setForgotMsg]         = useState('');

//     const { login } = useContext(AuthContext);
//     const navigate  = useNavigate();

//     const validate = () => {
//         const t = email.trim(), p = password.trim();
//         if (!t) return 'Email address is required.';
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'Please enter a valid email address.';
//         if (!p) return 'Password is required.';
//         if (p.length < 6) return 'Password must be at least 6 characters.';
//         return null;
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         const err = validate();
//         if (err) { setError(err); return; }
//         setError('');
//         setLoading(true);
//         try {
//             const data = await api.login(email.trim(), password.trim());
//             if (data.token) {
//                 const validRoles = ['super_admin', 'business_user', 'salesperson'];
//                 if (!validRoles.includes(data.user?.role)) {
//                     setError('Access denied. You do not have permission to use this portal.');
//                     return;
//                 }
//                 login(data.token, data.user);
//                 const role = data.user.role;
//                 if      (role === 'super_admin')   navigate('/admin/dashboard');
//                 else if (role === 'business_user') navigate('/business/dashboard');
//                 else                               navigate('/salesperson/dashboard');
//             } else if (data.status === 'pending') {
//                 navigate('/pending');
//             } else if (data.status === 'rejected') {
//                 setError('Your account registration was rejected. Please contact the admin.');
//             } else {
//                 setError(data.message || 'Invalid email or password.');
//             }
//         } catch {
//             setError('Unable to connect to the server. Please check your network.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleForgotPassword = async (e) => {
//         e.preventDefault();
//         if (!forgotEmail.trim()) { setForgotMsg('Please enter your email.'); return; }
//         setForgotLoading(true);
//         setForgotMsg('');
//         try {
//             await api.forgotPassword(forgotEmail.trim());
//             setForgotMsg('✅ Password reset link has been sent to your email.');
//         } catch {
//             setForgotMsg('❌ Unable to send reset email. Please try again.');
//         } finally {
//             setForgotLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-300">

//             {/* ── Ambient glow orbs ── */}
//             <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] bg-primary/8 dark:bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
//             <div className="absolute bottom-1/4 right-1/4 w-[340px] h-[340px] bg-accent/6 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

//             <div className="w-full max-w-md relative z-10 animate-fade-in">

//                 {/* ── Brand Block ── */}
//                 <div className="flex flex-col items-center mb-8">
//                     <div className="w-16 h-16 rounded-2xl bg-primary-soft dark:bg-primary/20 border border-primary-200 dark:border-primary/30 shadow-glow flex items-center justify-center mb-4 transition-all duration-300">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl shadow-lg">
//                             📞
//                         </div>
//                     </div>
//                     <h1 className="text-3xl font-extrabold text-heading dark:text-heading-dark tracking-tight">Callyzer</h1>
//                     <p className="text-sm text-subtle dark:text-subtle-dark mt-1 tracking-wide">Call Management System</p>
//                 </div>

//                 {/* ── Login Card ── */}
//                 <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-7 transition-all duration-300">
//                     <h2 className="text-xl font-bold text-heading dark:text-heading-dark tracking-tight">Welcome back</h2>
//                     <p className="text-sm text-subtle dark:text-subtle-dark mt-1 mb-6">Sign in to continue to your workspace</p>

//                     {/* Error alert */}
//                     {error && (
//                         <div className="bg-danger-soft dark:bg-danger/10 border border-danger/20 dark:border-danger/20 text-danger rounded-xl px-4 py-3 text-sm mb-5 flex items-start gap-2.5 animate-fade-in">
//                             <span className="mt-0.5 shrink-0">⚠️</span>
//                             <span>{error}</span>
//                         </div>
//                     )}

//                     <form onSubmit={handleLogin} className="space-y-5">

//                         {/* ── Email ── */}
//                         <div>
//                             <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
//                                 Email Address
//                             </label>
//                             <div className={`
//                                 flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200
//                                 bg-input dark:bg-input-dark border-2
//                                 ${focusedField === 'email'
//                                     ? 'border-primary dark:border-primary-light shadow-glow'
//                                     : 'border-line dark:border-line-dark hover:border-line-strong dark:hover:border-line-dark-strong'}
//                             `}>
//                                 <span className="text-subtle dark:text-subtle-dark text-base">✉️</span>
//                                 <input
//                                     type="email"
//                                     placeholder="you@company.com"
//                                     value={email}
//                                     onChange={e => setEmail(e.target.value)}
//                                     onFocus={() => setFocusedField('email')}
//                                     onBlur={() => setFocusedField(null)}
//                                     className="flex-1 bg-transparent text-heading dark:text-heading-dark text-sm outline-none placeholder-subtle dark:placeholder-subtle-dark"
//                                 />
//                             </div>
//                         </div>

//                         {/* ── Password ── */}
//                         <div>
//                             <label className="block text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-2">
//                                 Password
//                             </label>
//                             <div className={`
//                                 flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200
//                                 bg-input dark:bg-input-dark border-2
//                                 ${focusedField === 'password'
//                                     ? 'border-primary dark:border-primary-light shadow-glow'
//                                     : 'border-line dark:border-line-dark hover:border-line-strong dark:hover:border-line-dark-strong'}
//                             `}>
//                                 <span className="text-subtle dark:text-subtle-dark text-base">🔒</span>
//                                 <input
//                                     type={pwdVisible ? 'text' : 'password'}
//                                     placeholder="Enter your password"
//                                     value={password}
//                                     onChange={e => setPassword(e.target.value)}
//                                     onFocus={() => setFocusedField('password')}
//                                     onBlur={() => setFocusedField(null)}
//                                     className="flex-1 bg-transparent text-heading dark:text-heading-dark text-sm outline-none placeholder-subtle dark:placeholder-subtle-dark"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setPwdVisible(v => !v)}
//                                     className="text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark transition-colors duration-200 cursor-pointer"
//                                 >
//                                     {pwdVisible ? '🙈' : '👁️'}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* ── Submit Button ── */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-light hover:to-primary dark:from-primary dark:to-accent dark:hover:from-primary-light dark:hover:to-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-elevated hover:shadow-float hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
//                         >
//                             {loading ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                                     </svg>
//                                     Signing in...
//                                 </span>
//                             ) : 'Sign In'}
//                         </button>

//                         {/* ── Links ── */}
//                         <div className="flex flex-col items-center gap-2.5 pt-1">
//                             <button
//                                 type="button"
//                                 onClick={() => setForgotOpen(true)}
//                                 className="text-sm text-primary dark:text-primary-light font-semibold hover:text-primary-hover dark:hover:text-primary-200 hover:underline underline-offset-4 flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
//                             >
//                                 🔑 Forgot Password?
//                             </button>
//                             <div className="w-1 h-1 rounded-full bg-line dark:bg-line-dark" />
//                             <Link to="/register" className="text-sm text-subtle dark:text-subtle-dark hover:text-body dark:hover:text-body-dark transition-colors duration-200">
//                                 New Team Lead? <span className="text-primary dark:text-primary-light font-bold">Register here</span>
//                             </Link>
//                         </div>
//                     </form>
//                 </div>

//                 {/* ── Footer ── */}
//                 <div className="flex items-center justify-center gap-2.5 mt-6">
//                     <div className="w-1 h-1 rounded-full bg-subtle dark:bg-subtle-dark" />
//                     <p className="text-xs text-subtle dark:text-subtle-dark tracking-wide">Secure · Encrypted · Reliable</p>
//                     <div className="w-1 h-1 rounded-full bg-subtle dark:bg-subtle-dark" />
//                 </div>
//             </div>

//             {/* ── Forgot Password Modal ── */}
//             {forgotOpen && (
//                 <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//                     <div className="bg-card dark:bg-card-dark/90 dark:backdrop-blur-xl rounded-2xl shadow-float dark:shadow-glow-lg border border-line dark:border-white/5 w-full max-w-sm p-7 relative animate-fade-in transition-colors duration-300">

//                         {/* Close button */}
//                         <button
//                             onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
//                             className="absolute top-4 right-4 w-8 h-8 rounded-full bg-raised dark:bg-raised-dark hover:bg-hover-bg dark:hover:bg-hover-bg-dark flex items-center justify-center text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark font-bold transition-all duration-200 cursor-pointer"
//                         >
//                             ✕
//                         </button>

//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-14 h-14 rounded-full bg-primary-soft dark:bg-primary/15 flex items-center justify-center mb-4 text-2xl">
//                                 ✉️
//                             </div>
//                             <h3 className="text-xl font-bold text-heading dark:text-heading-dark tracking-tight mb-1">Forgot Password?</h3>
//                             <p className="text-sm text-subtle dark:text-subtle-dark mb-5 leading-relaxed">
//                                 Enter your email address and we'll<br/>send you a reset link.
//                             </p>
//                         </div>

//                         {/* Status message */}
//                         {forgotMsg && (
//                             <div className={`text-sm rounded-xl px-4 py-3 mb-4 text-center transition-colors duration-200 ${
//                                 forgotMsg.startsWith('✅')
//                                     ? 'bg-success-soft dark:bg-success/10 text-success'
//                                     : 'bg-danger-soft dark:bg-danger/10 text-danger'
//                             }`}>
//                                 {forgotMsg}
//                             </div>
//                         )}

//                         <form onSubmit={handleForgotPassword} className="space-y-4">
//                             <input
//                                 type="email"
//                                 placeholder="Enter your email address"
//                                 value={forgotEmail}
//                                 onChange={e => setForgotEmail(e.target.value)}
//                                 className="w-full bg-input dark:bg-input-dark border-2 border-line dark:border-line-dark focus:border-primary dark:focus:border-primary-light rounded-xl px-4 py-3 text-sm text-heading dark:text-heading-dark outline-none placeholder-subtle dark:placeholder-subtle-dark transition-all duration-200"
//                             />
//                             <button
//                                 type="submit"
//                                 disabled={forgotLoading}
//                                 className="w-full bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-accent hover:from-primary-light hover:to-primary disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-float hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
//                             >
//                                 {forgotLoading ? 'Sending...' : '📤 Send Reset Link'}
//                             </button>

//                             <div className="flex items-center gap-3">
//                                 <div className="flex-1 h-px bg-line dark:bg-line-dark" />
//                                 <span className="text-xs text-subtle dark:text-subtle-dark font-medium">OR</span>
//                                 <div className="flex-1 h-px bg-line dark:bg-line-dark" />
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={() => { setForgotOpen(false); setForgotEmail(''); setForgotMsg(''); }}
//                                 className="w-full py-3 text-sm text-subtle dark:text-subtle-dark hover:text-heading dark:hover:text-heading-dark font-medium transition-colors duration-200 cursor-pointer"
//                             >
//                                 Cancel
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Mail, Lock, Eye, EyeOff, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input, Alert } from '../components/UI';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    // Forgot password
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMsg, setForgotMsg] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('rememberedEmail');
        if (saved) { setEmail(saved); setRememberMe(true); }
    }, []);

    const getFieldError = (field) => {
        if (!touched[field]) return '';
        if (field === 'email') {
            if (!email.trim()) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email format';
        }
        if (field === 'password') {
            if (!password.trim()) return 'Password is required';
            if (password.trim().length < 6) return 'Min 6 characters';
        }
        return '';
    };

    const validate = () => {
        if (!email.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email.';
        if (!password.trim()) return 'Password is required.';
        if (password.trim().length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
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
                    setLoading(false);
                    return;
                }
                if (rememberMe) localStorage.setItem('rememberedEmail', email.trim());
                else localStorage.removeItem('rememberedEmail');
                login(data.token, data.user);
                const role = data.user.role;
                if (role === 'super_admin') navigate('/admin/dashboard');
                else if (role === 'business_user') navigate('/business/dashboard');
                else navigate('/salesperson/dashboard');
            } else if (data.status === 'pending') {
                navigate('/pending');
            } else if (data.status === 'rejected') {
                setError('Your account was rejected. Please contact the admin.');
            } else {
                setError(data.message || 'Invalid email or password.');
            }
        } catch {
            setError('Unable to connect to the server. Check your network.');
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
            setForgotMsg('success');
        } catch {
            setForgotMsg('error');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Left Panel – Branding */}
            <div className="hidden lg:flex lg:w-[46%] bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden transition-all duration-500">
                {/* Decorative circles */}
                <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-blue-600/10 transition-all duration-700 hover:scale-110" />
                <div className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full bg-cyan-500/10 transition-all duration-700 hover:scale-110" />
                <div className="absolute top-1/2 left-1/3 w-[180px] h-[180px] rounded-full bg-blue-500/5 transition-all duration-700 hover:scale-110" />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <PhoneCall size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">Callyzer</span>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Intelligent Call<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                Management Platform
                            </span>
                        </h2>
                        <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-sm">
                            Track, analyze, and optimize your sales team's call performance with real-time insights and powerful analytics.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="space-y-3">
                        {[
                            'Real-time call tracking & analytics',
                            'Team performance leaderboards',
                            'Automated call log sync',
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                                <p className="text-slate-300 text-sm">{f}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-8 relative z-10 border-t border-white/10 pt-8">
                    {[{ label: 'Active Users', val: '2,400+' }, { label: 'Calls Tracked', val: '1.2M+' }, { label: 'Avg Rating', val: '4.9 ★' }].map((s) => (
                        <div key={s.label}>
                            <p className="text-xl font-bold text-white">{s.val}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 transition-all duration-300">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2.5 mb-10">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <PhoneCall size={16} className="text-white" />
                    </div>
                    <span className="text-slate-900 font-bold text-lg">Callyzer</span>
                </div>

                <div className="w-full max-w-[400px] transition-all duration-300">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="text-slate-500 mt-1.5 text-sm">Sign in to your workspace to continue</p>
                    </div>

                    {error && (
                        <div className="mb-5">
                            <Alert type="error">{error}</Alert>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4 transition-all duration-200">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            onBlur={() => setTouched(t => ({ ...t, email: true }))}
                            icon={Mail}
                            error={getFieldError('email')}
                            autoComplete="email"
                        />

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setForgotOpen(true)}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input
                                type={showPwd ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                icon={Lock}
                                iconRight={showPwd ? EyeOff : Eye}
                                onIconRightClick={() => setShowPwd(v => !v)}
                                error={getFieldError('password')}
                                autoComplete="current-password"
                            />
                        </div>

                        <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                            />
                            <span className="text-sm text-slate-600">Remember my email</span>
                        </label>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full mt-2"
                        >
                            {!loading && <ArrowRight size={16} />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Register as Team Lead
                        </Link>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {forgotOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setForgotOpen(false); setForgotMsg(''); setForgotEmail(''); }} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-in">
                        <button
                            onClick={() => { setForgotOpen(false); setForgotMsg(''); setForgotEmail(''); }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Reset Password</h3>
                        <p className="text-sm text-slate-500 mb-5">Enter your email and we'll send a reset link.</p>

                        {forgotMsg === 'success' ? (
                            <div className="space-y-4">
                                <Alert type="success">Reset link sent! Check your email.</Alert>
                                <Button variant="primary" onClick={() => { setForgotOpen(false); setForgotMsg(''); setForgotEmail(''); }} className="w-full">
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <>
                                {forgotMsg === 'error' && (
                                    <div className="mb-4">
                                        <Alert type="error">Could not send reset email. Try again.</Alert>
                                    </div>
                                )}
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={forgotEmail}
                                        onChange={e => setForgotEmail(e.target.value)}
                                        icon={Mail}
                                        autoFocus
                                    />
                                    <div className="flex gap-3">
                                        <Button variant="secondary" onClick={() => { setForgotOpen(false); setForgotMsg(''); setForgotEmail(''); }} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="primary" loading={forgotLoading} className="flex-1">
                                            Send Link
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}