import React from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
    { icon: '✓', label: 'Registration Submitted', sub: 'Your details have been received', color: 'bg-emerald-500' },
    { icon: '2', label: 'Admin Review', sub: 'Super Admin will verify your account', color: 'bg-amber-500' },
    { icon: '3', label: 'Account Activated', sub: 'You can login with your credentials', color: 'bg-gray-300' },
];

export default function Pending() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">

                {/* Icon */}
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg shadow-amber-100">
                    ⏳
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Account Under Review</h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 px-4">
                    Your registration has been submitted successfully. The Super Admin will review and approve your account shortly.
                </p>

                {/* Steps */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 text-left">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm">What happens next?</h3>
                    {steps.map((step, i) => (
                        <div key={i}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{step.label}</p>
                                    <p className="text-xs text-gray-500">{step.sub}</p>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-0.5 h-5 bg-gray-200 ml-4 my-1" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-700">
                    💡 This usually takes a few hours. Contact your Callyzer admin if you need faster access.
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}