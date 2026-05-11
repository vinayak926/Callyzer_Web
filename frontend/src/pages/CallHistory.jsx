// import React, { useState, useEffect, useCallback } from 'react';
// import { api } from '../services/api';

// const fmtDuration = (s) => {
//     if (!s && s !== 0) return '—';
//     const sec = Number(s);
//     if (isNaN(sec)) return '—';
//     const m = Math.floor(sec / 60), r = sec % 60;
//     return m > 0 ? `${m}m ${r}s` : `${r}s`;
// };

// const fmtDate = (d) => {
//     if (!d) return '—';
//     const dt = new Date(d);
//     return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
// };

// const fmtTime = (d) => {
//     if (!d) return '';
//     const dt = new Date(d);
//     return isNaN(dt.getTime()) ? '' : dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
// };

// const TYPE_COLORS = { Incoming: 'bg-blue-100 text-blue-700', Outgoing: 'bg-purple-100 text-purple-700' };
// const STATUS_COLORS = { Connected: 'bg-green-100 text-green-700', Missed: 'bg-red-100 text-red-700', Rejected: 'bg-amber-100 text-amber-700' };

// export default function CallHistory() {
//     const [logs, setLogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState('');
//     const [filter, setFilter] = useState('All');
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [total, setTotal] = useState(0);
//     const [error, setError] = useState('');

//     const fetchLogs = useCallback(async (pageNum = 1) => {
//         setLoading(true);
//         setError('');
//         try {
//             const callTypeParam = filter === 'All' ? '' : filter;
//             const data = await api.getCallLogs({
//                 page: pageNum,
//                 limit: 20,
//                 search: search,
//                 callType: callTypeParam,
//                 sortField: 'calledAt',
//                 sortDir: 'desc'
//             });
//             setLogs(data.logs || []);
//             setTotal(data.pagination?.total || 0);
//             setTotalPages(data.pagination?.pages || 1);
//             setPage(pageNum);
//         } catch (err) {
//             setError(err.message || 'Failed to load call history');
//         } finally {
//             setLoading(false);
//         }
//     }, [search, filter]);

//     useEffect(() => { fetchLogs(1); }, [fetchLogs]);

//     const handleSearch = (e) => {
//         setSearch(e.target.value);
//         setTimeout(() => fetchLogs(1), 300);
//     };

//     const FILTERS = ['All', 'Incoming', 'Outgoing', 'Missed'];

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
//                 <h2 className="text-xl font-extrabold text-gray-900">Call History</h2>
//                 <p className="text-xs text-gray-500 mt-0.5">{total} call{total !== 1 ? 's' : ''} synced · Sorted newest first</p>
//             </div>

//             {/* Search */}
//             <div className="px-4 lg:px-6 py-3">
//                 <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm">
//                     <span className="text-sm">🔍</span>
//                     <input value={search} onChange={handleSearch} placeholder="Search name or number…" className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
//                     {search && <button onClick={() => { setSearch(''); fetchLogs(1); }} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>}
//                 </div>
//             </div>

//             {/* Filters */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2">
//                 <div className="flex gap-2 flex-wrap">
//                     {FILTERS.map(f => (
//                         <button key={f} onClick={() => { setFilter(f); fetchLogs(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
//                     ))}
//                 </div>
//             </div>

//             {/* List */}
//             <div className="flex-1 overflow-y-auto">
//                 {loading ? (
//                     <div className="flex flex-col items-center justify-center h-96 gap-3">
//                         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//                         <p className="text-sm text-gray-500">Loading your call history...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="flex flex-col items-center justify-center h-96 gap-3">
//                         <div className="text-5xl">⚠️</div>
//                         <p className="text-gray-800 font-bold">Could not load calls</p>
//                         <p className="text-gray-500 text-sm">{error}</p>
//                         <button onClick={() => fetchLogs(1)} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-bold">Try Again</button>
//                     </div>
//                 ) : logs.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-96 text-center gap-3">
//                         <div className="text-5xl">📭</div>
//                         <p className="text-gray-700 font-bold text-lg">No Call History</p>
//                         <p className="text-gray-500 text-sm">Your synced calls will appear here.</p>
//                         <p className="text-gray-400 text-xs">Go to <span className="text-indigo-600 font-bold">Sync Calls</span> to upload your device call logs.</p>
//                     </div>
//                 ) : (
//                     <div className="p-4 space-y-3">
//                         {logs.map((log, idx) => (
//                             <div key={log._id || idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
//                                 <div className="flex items-start justify-between">
//                                     <div className="flex-1">
//                                         <p className="font-bold text-gray-900">{log.customerName || 'Unknown'}</p>
//                                         <p className="text-sm text-gray-500 mt-0.5">{log.customerNumber}</p>
//                                         <p className="text-xs text-gray-400 mt-1">{fmtDate(log.calledAt)} · {fmtTime(log.calledAt)}</p>
//                                     </div>
//                                     <p className="text-sm font-semibold text-gray-600">⏱ {fmtDuration(log.durationSeconds)}</p>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
//                                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TYPE_COLORS[log.callType] || 'bg-gray-100 text-gray-600'}`}>{log.callType}</span>
//                                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${STATUS_COLORS[log.callStatus] || 'bg-gray-100 text-gray-600'}`}>
//                                         <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                                         {log.callStatus}
//                                     </span>
//                                     {log.source === 'device_sync' && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">📲 Synced</span>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && !loading && (
//                 <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
//                     <button disabled={page === 1} onClick={() => fetchLogs(page - 1)} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">← Prev</button>
//                     <span className="text-sm text-gray-600 font-semibold">Page {page} of {totalPages}</span>
//                     <button disabled={page === totalPages} onClick={() => fetchLogs(page + 1)} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">Next →</button>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
    History, ArrowDownLeft, ArrowUpRight, Clock, Phone, PhoneOff,
    ChevronLeft, ChevronRight, Search, Download,
} from 'lucide-react';
import {
    Badge, SearchInput, Select, Button, StatCard, LoadingPage, EmptyState,
} from '../components/UI';

const fmtDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const STATUS_CONFIG = {
    Connected: { variant: 'green', color: '#10B981', bg: '#ECFDF5' },
    Missed: { variant: 'red', color: '#F43F5E', bg: '#FFF1F2' },
    Rejected: { variant: 'yellow', color: '#F59E0B', bg: '#FFFBEB' },
    default: { variant: 'default', color: '#94A3B8', bg: '#F8FAFC' },
};

export default function CallHistory() {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [stats, setStats] = useState(null);
    const LIMIT = 20;

    const fetchHistory = async (p = 1) => {
        setLoading(true);
        try {
            const data = await api.getMyCallHistory({
                page: p, limit: LIMIT,
                search,
                callType: typeFilter,
                callStatus: statusFilter,
                dateFrom,
                dateTo,
            });
            setLogs(data.logs || data.data || []);
            setTotalPages(data.pagination?.pages || Math.ceil((data.pagination?.total || data.total || 0) / LIMIT) || 1);
            setTotalLogs(data.pagination?.total || data.total || 0);
            setStats(data.stats || data.summary || null);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => {
        setPage(1);
        fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter, typeFilter, dateFrom, dateTo]);

    const resetFilters = () => {
        setSearch(''); setStatusFilter(''); setTypeFilter('');
        setDateFrom(''); setDateTo(''); setPage(1);
    };

    const hasFilters = search || statusFilter || typeFilter || dateFrom || dateTo;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Call History</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Your complete call record · {totalLogs.toLocaleString()} total
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => api.exportCallLogs?.({ format: 'csv' })}
                >
                    Export CSV
                </Button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total" value={stats.total || totalLogs} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                    <StatCard label="Connected" value={stats.connected || 0} icon={Phone} color="#10B981" bgColor="#ECFDF5" />
                    <StatCard label="Missed" value={stats.missed || 0} icon={PhoneOff} color="#F43F5E" bgColor="#FFF1F2" />
                    <StatCard label="Avg Duration" value={fmtDuration(stats.avgDuration)} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" />
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <SearchInput
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name or number..."
                    />
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'All Statuses' },
                            { value: 'Connected', label: 'Connected' },
                            { value: 'Missed', label: 'Missed' },
                            { value: 'Rejected', label: 'Rejected' },
                        ]}
                    />
                    <Select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        options={[
                            { value: '', label: 'All Types' },
                            { value: 'Incoming', label: 'Incoming' },
                            { value: 'Outgoing', label: 'Outgoing' },
                        ]}
                    />
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors text-left sm:text-right"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From Date</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To Date</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field" />
                    </div>
                </div>
            </div>

            {/* Call List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <LoadingPage />
                ) : logs.length === 0 ? (
                    <EmptyState
                        icon={History}
                        title="No call history found"
                        description="No records match your current filters. Try adjusting your search."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Duration</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {logs.map((log, i) => {
                                        const sc = STATUS_CONFIG[log.callStatus] || STATUS_CONFIG.default;
                                        const isIn = log.callType === 'Incoming';
                                        return (
                                            <tr key={log._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                            style={{ backgroundColor: sc.bg }}
                                                        >
                                                            {isIn
                                                                ? <ArrowDownLeft size={15} style={{ color: sc.color }} />
                                                                : <ArrowUpRight size={15} style={{ color: sc.color }} />
                                                            }
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                                {log.customerName || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-slate-400 font-mono">{log.customerNumber || log.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge variant={isIn ? 'cyan' : 'blue'}>{log.callType || '—'}</Badge>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge variant={sc.variant} dot>{log.callStatus || '—'}</Badge>
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-slate-500 hidden sm:table-cell">
                                                    {fmtDuration(log.durationSeconds || log.duration)}
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap">
                                                    {fmtDateTime(log.calledAt || log.startTime)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400">
                                    Page {page} of {totalPages} · {totalLogs.toLocaleString()} records
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => { const np = page - 1; setPage(np); fetchHistory(np); }}
                                        disabled={page <= 1}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                        return (
                                            <button
                                                key={pg}
                                                onClick={() => { setPage(pg); fetchHistory(pg); }}
                                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${pg === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {pg}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => { const np = page + 1; setPage(np); fetchHistory(np); }}
                                        disabled={page >= totalPages}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}