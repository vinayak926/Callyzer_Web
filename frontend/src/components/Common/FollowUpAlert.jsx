import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function FollowUpAlert() {
    const [followUps, setFollowUps] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        // Sirf agents ke liye dikhao
        if (!token || !['agent', 'team_leader'].includes(role)) return;

        fetch(`${API}/calls/follow-ups`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.count > 0) {
                    setFollowUps(data.followUps);
                    setVisible(true);
                }
            })
            .catch(console.error);
    }, []);

    if (!visible || followUps.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-80 bg-white border border-amber-300 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-amber-50 px-4 py-3 flex items-center justify-between border-b border-amber-200">
                <div className="flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <span className="font-semibold text-amber-800 text-sm">
                        {followUps.length} Pending Follow-Up{followUps.length > 1 ? 's' : ''}
                    </span>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="text-amber-500 hover:text-amber-700 text-lg leading-none"
                >×</button>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {followUps.slice(0, 5).map(f => (
                    <div key={f._id} className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">{f.customerName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{f.customerNumber}</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            📅 {new Date(f.followUpDate).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                        {f.followUpNotes && (
                            <p className="text-xs text-gray-400 mt-0.5 italic">"{f.followUpNotes}"</p>
                        )}
                    </div>
                ))}
                {followUps.length > 5 && (
                    <div className="px-4 py-2 text-xs text-center text-gray-400">
                        +{followUps.length - 5} more — go to Call Logs to view all
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <a href="/call-logs"
                    className="text-xs text-blue-600 hover:underline font-medium"
                    onClick={() => setVisible(false)}
                >
                    View all in Call Logs →
                </a>
            </div>
        </div>
    );
}