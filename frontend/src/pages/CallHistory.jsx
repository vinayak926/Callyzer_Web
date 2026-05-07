import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtDuration = (s) => {
    if (!s && s !== 0) return '—';
    const sec = Number(s);
    if (isNaN(sec)) return '—';
    const m = Math.floor(sec / 60), r = sec % 60;
    return m > 0 ? `${m}m ${r}s` : `${r}s`;
};

const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtTime = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? '' : dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const TYPE_COLORS = { Incoming: 'bg-blue-100 text-blue-700', Outgoing: 'bg-purple-100 text-purple-700' };
const STATUS_COLORS = { Connected: 'bg-green-100 text-green-700', Missed: 'bg-red-100 text-red-700', Rejected: 'bg-amber-100 text-amber-700' };

export default function CallHistory() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');

    const fetchLogs = useCallback(async (pageNum = 1) => {
        setLoading(true);
        setError('');
        try {
            const callTypeParam = filter === 'All' ? '' : filter;
            const data = await api.getCallLogs({
                page: pageNum,
                limit: 20,
                search: search,
                callType: callTypeParam,
                sortField: 'calledAt',
                sortDir: 'desc'
            });
            setLogs(data.logs || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.pages || 1);
            setPage(pageNum);
        } catch (err) {
            setError(err.message || 'Failed to load call history');
        } finally {
            setLoading(false);
        }
    }, [search, filter]);

    useEffect(() => { fetchLogs(1); }, [fetchLogs]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setTimeout(() => fetchLogs(1), 300);
    };

    const FILTERS = ['All', 'Incoming', 'Outgoing', 'Missed'];

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
                <h2 className="text-xl font-extrabold text-gray-900">Call History</h2>
                <p className="text-xs text-gray-500 mt-0.5">{total} call{total !== 1 ? 's' : ''} synced · Sorted newest first</p>
            </div>

            {/* Search */}
            <div className="px-4 lg:px-6 py-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm">
                    <span className="text-sm">🔍</span>
                    <input value={search} onChange={handleSearch} placeholder="Search name or number…" className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
                    {search && <button onClick={() => { setSearch(''); fetchLogs(1); }} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2">
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => { setFilter(f); fetchLogs(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-3">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Loading your call history...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-3">
                        <div className="text-5xl">⚠️</div>
                        <p className="text-gray-800 font-bold">Could not load calls</p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button onClick={() => fetchLogs(1)} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-bold">Try Again</button>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center gap-3">
                        <div className="text-5xl">📭</div>
                        <p className="text-gray-700 font-bold text-lg">No Call History</p>
                        <p className="text-gray-500 text-sm">Your synced calls will appear here.</p>
                        <p className="text-gray-400 text-xs">Go to <span className="text-indigo-600 font-bold">Sync Calls</span> to upload your device call logs.</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        {logs.map((log, idx) => (
                            <div key={log._id || idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{log.customerName || 'Unknown'}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{log.customerNumber}</p>
                                        <p className="text-xs text-gray-400 mt-1">{fmtDate(log.calledAt)} · {fmtTime(log.calledAt)}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600">⏱ {fmtDuration(log.durationSeconds)}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TYPE_COLORS[log.callType] || 'bg-gray-100 text-gray-600'}`}>{log.callType}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${STATUS_COLORS[log.callStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {log.callStatus}
                                    </span>
                                    {log.source === 'device_sync' && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">📲 Synced</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button disabled={page === 1} onClick={() => fetchLogs(page - 1)} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">← Prev</button>
                    <span className="text-sm text-gray-600 font-semibold">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => fetchLogs(page + 1)} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">Next →</button>
                </div>
            )}
        </div>
    );
}