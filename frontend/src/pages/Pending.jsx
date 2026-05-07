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

import React from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
    { icon: '✓', label: 'Registration Submitted', sub: 'Your details have been received', color: 'bg-success' },
    { icon: '2', label: 'Admin Review', sub: 'Super Admin will verify your account', color: 'bg-warning' },
    { icon: '3', label: 'Account Activated', sub: 'You can login with your credentials', color: 'bg-subtle dark:bg-subtle-dark' },
];

export default function Pending() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

            {/* ── Ambient glow orbs ── */}
            <div className="absolute top-1/3 left-1/3 w-[380px] h-[380px] bg-warning/8 dark:bg-warning/12 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary/6 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md text-center relative z-10 animate-fade-in">

                {/* ── Icon ── */}
                <div className="w-24 h-24 bg-warning-soft dark:bg-warning/15 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-elevated dark:shadow-glow animate-glow-pulse">
                    ⏳
                </div>

                <h1 className="text-2xl font-extrabold text-heading dark:text-heading-dark tracking-tight mb-3">Account Under Review</h1>
                <p className="text-body dark:text-body-dark text-sm leading-relaxed mb-8 px-4">
                    Your registration has been submitted successfully. The Super Admin will review and approve your account shortly.
                </p>

                {/* ── Steps Card ── */}
                <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-elevated dark:shadow-glow border border-line dark:border-white/5 p-6 mb-4 text-left transition-all duration-300">
                    <h3 className="font-bold text-heading dark:text-heading-dark mb-4 text-sm tracking-tight">What happens next?</h3>
                    {steps.map((step, i) => (
                        <div key={i}>
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-card`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-heading dark:text-heading-dark">{step.label}</p>
                                    <p className="text-xs text-subtle dark:text-subtle-dark">{step.sub}</p>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-0.5 h-5 bg-line dark:bg-line-dark ml-4 my-1 rounded-full" />
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Info Box ── */}
                <div className="bg-primary-soft dark:bg-primary/10 border border-primary/15 dark:border-primary/20 rounded-xl p-4 mb-6 text-sm text-primary dark:text-primary-light transition-colors duration-200">
                    💡 This usually takes a few hours. Contact your Callyzer admin if you need faster access.
                </div>

                {/* ── Back Button ── */}
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 border-2 border-line dark:border-line-dark text-body dark:text-body-dark font-bold rounded-xl hover:bg-hover-bg dark:hover:bg-hover-bg-dark hover:border-line-strong dark:hover:border-line-dark-strong hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm cursor-pointer"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}