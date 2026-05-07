import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminApprovals() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchPending = async () => {
        try {
            const data = await api.getPendingApprovals();
            setUsers(data.users || []);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { fetchPending(); }, []);

    const doAction = async (id, action) => {
        setActionLoading(id + action);
        try {
            const fn = action === 'approve' ? api.approveUser : api.rejectUser;
            const data = await fn(id);
            showToast(data.message || `User ${action}d successfully.`);
            fetchPending();
        } catch { showToast('Network error. Please try again.'); }
        setActionLoading(null);
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {toast && (
                <div className="fixed top-4 right-4 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold text-gray-900">{users.length}</span>
                    <span className="text-gray-500 text-sm font-medium">Pending Approval{users.length !== 1 ? 's' : ''}</span>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${users.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {users.length > 0 ? '⚠️ Action needed' : '✓ All clear'}
                </span>
            </div>

            {/* Empty */}
            {users.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <p className="text-5xl mb-4">🎉</p>
                    <p className="text-lg font-bold text-gray-900 mb-2">No Pending Approvals</p>
                    <p className="text-gray-500 text-sm">All Business User registrations have been reviewed.</p>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {users.map(item => {
                    const isApproving = actionLoading === item._id + 'approve';
                    const isRejecting = actionLoading === item._id + 'reject';
                    const isBusy = isApproving || isRejecting;
                    return (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            {/* Top */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl shrink-0">
                                    {(item.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{item.email}</p>
                                    {item.phone && <p className="text-xs text-gray-400">📱 {item.phone}</p>}
                                </div>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Pending</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">🗓 Registered: {fmt(item.createdAt)}</p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => doAction(item._id, 'reject')}
                                    disabled={isBusy}
                                    className="flex-1 py-2.5 border-2 border-red-500 text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                                >
                                    {isRejecting ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : '✗  Reject'}
                                </button>
                                <button
                                    onClick={() => doAction(item._id, 'approve')}
                                    disabled={isBusy}
                                    className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-100"
                                >
                                    {isApproving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✓  Approve'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}