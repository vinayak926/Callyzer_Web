// ============================================
// PENDING PAGE — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • bg-page / dark:bg-page-dark with ambient glow
//   • Glassmorphic card for steps section
//   • Step icons: success=green, review=warning, pending=muted
//   • Accent-tinted info box
//   • Outlined "Back to Login" with hover lift
//   • dark: variant on EVERY element
// UNCHANGED: All state, logic, navigation, steps data
// ============================================

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const steps = [
//     { icon: '✓', label: 'Registration Submitted', sub: 'Your details have been received', color: 'bg-success' },
//     { icon: '2', label: 'Admin Review', sub: 'Super Admin will verify your account', color: 'bg-warning' },
//     { icon: '3', label: 'Account Activated', sub: 'You can login with your credentials', color: 'bg-subtle dark:bg-subtle-dark' },
// ];

// export default function Pending() {
//     const navigate = useNavigate();

//     return (
//         <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

//             {/* ── Ambient glow orbs ── */}
//             <div className="absolute top-1/3 left-1/3 w-[380px] h-[380px] bg-warning/8 dark:bg-warning/12 rounded-full blur-[100px] pointer-events-none" />
//             <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary/6 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

//             <div className="w-full max-w-md text-center relative z-10 animate-fade-in">

//                 {/* ── Icon ── */}
//                 <div className="w-24 h-24 bg-warning-soft dark:bg-warning/15 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-elevated dark:shadow-glow animate-glow-pulse">
//                     ⏳
//                 </div>

//                 <h1 className="text-2xl font-extrabold text-heading dark:text-heading-dark tracking-tight mb-3">Account Under Review</h1>
//                 <p className="text-body dark:text-body-dark text-sm leading-relaxed mb-8 px-4">
//                     Your registration has been submitted successfully. The Super Admin will review and approve your account shortly.
//                 </p>

//                 {/* ── Steps Card ── */}
//                 <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-6 mb-4 text-left transition-all duration-300">
//                     <h3 className="font-bold text-heading dark:text-heading-dark mb-4 text-sm tracking-tight">What happens next?</h3>
//                     {steps.map((step, i) => (
//                         <div key={i}>
//                             <div className="flex items-center gap-3.5">
//                                 <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-card`}>
//                                     {step.icon}
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-sm text-heading dark:text-heading-dark">{step.label}</p>
//                                     <p className="text-xs text-subtle dark:text-subtle-dark">{step.sub}</p>
//                                 </div>
//                             </div>
//                             {i < steps.length - 1 && (
//                                 <div className="w-0.5 h-5 bg-line dark:bg-line-dark ml-4 my-1 rounded-full" />
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Info Box ── */}
//                 <div className="bg-primary-soft dark:bg-primary/10 border border-primary/15 dark:border-primary/20 rounded-xl p-4 mb-6 text-sm text-primary dark:text-primary-light transition-colors duration-200">
//                     💡 This usually takes a few hours. Contact your Callyzer admin if you need faster access.
//                 </div>

//                 {/* ── Back Button ── */}
//                 <button
//                     onClick={() => navigate('/login')}
//                     className="px-8 py-3 border-2 border-line dark:border-line-dark text-body dark:text-body-dark font-bold rounded-xl hover:bg-hover-bg dark:hover:bg-hover-bg-dark hover:border-line-strong dark:hover:border-line-dark-strong hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm cursor-pointer"
//                 >
//                     Back to Login
//                 </button>
//             </div>
//         </div>
//     );
// }

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, CheckCircle2, Clock, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI';

const steps = [
    { icon: CheckCircle2, label: 'Registration Submitted', sub: 'Your details have been received', done: true },
    { icon: Clock, label: 'Admin Review', sub: 'Super Admin will verify your account', done: false },
    { icon: Zap, label: 'Account Activated', sub: 'You can login with your credentials', done: false },
];

export default function Pending() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <PhoneCall size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-900 text-lg">Callyzer</span>
                </div>

                {/* Icon + Heading */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-100">
                        <Clock size={36} className="text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Under Review</h1>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Your registration was submitted successfully. The Super Admin will review and approve your account shortly.
                    </p>
                </div>

                {/* Steps Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">What happens next?</h3>
                    <div className="space-y-0">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${step.done ? 'bg-emerald-100' : i === 1 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                                            <Icon size={18} className={step.done ? 'text-emerald-600' : i === 1 ? 'text-amber-500' : 'text-slate-400'} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{step.sub}</p>
                                        </div>
                                        {step.done && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                                                <CheckCircle2 size={13} className="text-emerald-600" />
                                            </div>
                                        )}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="w-px h-5 bg-slate-100 ml-[17px] my-1.5" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700 leading-snug">
                        <span className="font-semibold">Tip:</span> This review usually takes a few hours. Contact your Callyzer admin if you need faster access.
                    </p>
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="w-full"
                    icon={ArrowLeft}
                >
                    Back to Login
                </Button>
            </div>
        </div>
    );
}