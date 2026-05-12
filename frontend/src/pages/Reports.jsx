// src/pages/Reports.jsx
// Role-based report page:
//   salesperson  → sees only own call logs (GET /api/reports/my-calllogs)
//   business_user → redirected to /business/salesperson-reports
//   super_admin   → existing generic reports view (unchanged)

// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { api } from '../services/api';
// import {
//     Phone, PhoneOff, PhoneCall, Clock, TrendingUp,
//     Calendar, Download, RefreshCcw, Filter, FileText,
//     CheckCircle, XCircle,
// } from 'lucide-react';
// import { Card, StatCard, Button, LoadingPage, Badge } from '../components/UI';

// // ── Helpers ────────────────────────────────────────────────
// const today = () => new Date().toISOString().split('T')[0];

// const fmtDuration = (sec) => {
//     if (!sec || sec === 0) return '0s';
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = Math.round(sec % 60);
//     if (h > 0) return `${h}h ${m}m`;
//     if (m > 0) return `${m}m ${s}s`;
//     return `${s}s`;
// };

// const fmtDateTime = (d) =>
//     d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

// const statusColor = (s) => {
//     if (s === 'Connected') return 'green';
//     if (s === 'Missed')    return 'red';
//     return 'yellow';
// };

// // ── Status Badge ───────────────────────────────────────────
// function StatusBadge({ status }) {
//     const colors = {
//         Connected: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
//         Missed:    'bg-rose-50 text-rose-700 border border-rose-200',
//         Rejected:  'bg-amber-50 text-amber-700 border border-amber-200',
//     };
//     return (
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || colors.Rejected}`}>
//             {status}
//         </span>
//     );
// }

// // ── CSV Export ─────────────────────────────────────────────
// function downloadCSV(calls, salespersonName = 'My') {
//     if (!calls.length) return;
//     const headers = ['Date & Time', 'Customer Name', 'Phone', 'Type', 'Status', 'Duration', 'Disposition', 'Notes'];
//     const rows = calls.map(c => [
//         fmtDateTime(c.calledAt),
//         c.customerName || '—',
//         c.customerNumber || '—',
//         c.callType || '—',
//         c.callStatus || '—',
//         fmtDuration(c.durationSeconds),
//         c.disposition || '—',
//         (c.notes || '').replace(/,/g, ';'),
//     ]);
//     const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href     = url;
//     a.download = `${salespersonName}-call-report-${today()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
// }

// // ══════════════════════════════════════════════════════════
// //  SALESPERSON REPORT PAGE
// // ══════════════════════════════════════════════════════════
// function SalespersonReport({ user }) {
//     const [fromDate, setFromDate] = useState(today());
//     const [toDate,   setToDate]   = useState(today());
//     const [loading,  setLoading]  = useState(true);
//     const [data,     setData]     = useState(null);
//     const [error,    setError]    = useState('');

//     const fetchReport = useCallback(async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const res = await api.getMyCallLogReport({ fromDate, toDate });
//             if (res?.summary) {
//                 setData(res);
//             } else {
//                 setError(res?.message || 'Failed to load report.');
//             }
//         } catch {
//             setError('Cannot connect to server. Please try again.');
//         }
//         setLoading(false);
//     }, [fromDate, toDate]);

//     useEffect(() => { fetchReport(); }, [fetchReport]);

//     const summary = data?.summary || {};
//     const calls   = data?.calls   || [];

//     return (
//         <div className="space-y-5">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div>
//                     <h2 className="text-xl font-bold text-slate-900">My Call Report</h2>
//                     <p className="text-sm text-slate-400 mt-0.5">Your personal call performance</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="secondary" size="sm" icon={Download}
//                         onClick={() => downloadCSV(calls, user?.name || 'My')}
//                         disabled={!calls.length}
//                     >
//                         Download CSV
//                     </Button>
//                     <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchReport}>
//                         Refresh
//                     </Button>
//                 </div>
//             </div>

//             {/* Date Filter */}
//             <Card>
//                 <div className="flex items-center gap-2 mb-3">
//                     <Filter size={15} className="text-slate-400" />
//                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Range</span>
//                     <span className="ml-auto text-xs text-slate-400">(Default: Today)</span>
//                 </div>
//                 <div className="grid sm:grid-cols-2 gap-3">
//                     <div>
//                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
//                         <input
//                             type="date" value={fromDate} max={toDate}
//                             onChange={e => setFromDate(e.target.value)}
//                             className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
//                         <input
//                             type="date" value={toDate} min={fromDate}
//                             onChange={e => setToDate(e.target.value)}
//                             className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>
//             </Card>

//             {/* Error */}
//             {error && (
//                 <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center justify-between">
//                     <p className="text-rose-700 text-sm font-medium">⚠️ {error}</p>
//                     <button onClick={fetchReport} className="text-rose-600 font-semibold text-sm ml-4 hover:underline">Retry →</button>
//                 </div>
//             )}

//             {loading ? (
//                 <LoadingPage />
//             ) : (
//                 <>
//                     {/* Summary Stats */}
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                         <StatCard
//                             label="Total Calls" value={summary.total ?? 0}
//                             icon={Phone} color="#3B82F6" bgColor="#EFF6FF"
//                         />
//                         <StatCard
//                             label="Connected" value={summary.connected ?? 0}
//                             icon={CheckCircle} color="#10B981" bgColor="#ECFDF5"
//                         />
//                         <StatCard
//                             label="Not Connected" value={summary.notConnected ?? 0}
//                             icon={XCircle} color="#F43F5E" bgColor="#FFF1F2"
//                         />
//                         <StatCard
//                             label="Total Duration" value={summary.totalDuration || '0s'}
//                             icon={Clock} color="#8B5CF6" bgColor="#F5F3FF"
//                         />
//                     </div>

//                     {/* Connection Rate + Avg Duration */}
//                     <div className="grid lg:grid-cols-3 gap-4">
//                         <Card>
//                             <div className="flex items-center gap-2 mb-4">
//                                 <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
//                                     <TrendingUp size={18} className="text-emerald-600" />
//                                 </div>
//                                 <p className="font-bold text-slate-800">Connection Rate</p>
//                             </div>
//                             <div className="flex items-center justify-center mb-4">
//                                 <div className="relative w-28 h-28">
//                                     <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
//                                         <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="4" />
//                                         <circle
//                                             cx="18" cy="18" r="15.9" fill="none"
//                                             stroke={summary.connectRate >= 50 ? '#10B981' : '#F43F5E'}
//                                             strokeWidth="4"
//                                             strokeDasharray={`${summary.connectRate ?? 0} ${100 - (summary.connectRate ?? 0)}`}
//                                             strokeLinecap="round"
//                                         />
//                                     </svg>
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                                         <p className="text-2xl font-bold text-slate-900">{summary.connectRate ?? 0}%</p>
//                                         <p className="text-[10px] text-slate-400">Rate</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="space-y-1.5 text-sm">
//                                 <div className="flex justify-between"><span className="text-slate-500">Connected</span><span className="font-semibold text-emerald-600">{summary.connected ?? 0}</span></div>
//                                 <div className="flex justify-between"><span className="text-slate-500">Missed</span><span className="font-semibold text-rose-600">{summary.missed ?? 0}</span></div>
//                                 <div className="flex justify-between"><span className="text-slate-500">Rejected</span><span className="font-semibold text-amber-600">{summary.rejected ?? 0}</span></div>
//                             </div>
//                         </Card>

//                         <Card className="lg:col-span-2">
//                             <p className="font-bold text-slate-800 mb-4">Duration Summary</p>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="bg-purple-50 rounded-xl p-4 text-center">
//                                     <p className="text-2xl font-bold text-purple-700">{summary.totalDuration || '0s'}</p>
//                                     <p className="text-xs text-purple-500 mt-1 font-medium">Total Talk Time</p>
//                                 </div>
//                                 <div className="bg-blue-50 rounded-xl p-4 text-center">
//                                     <p className="text-2xl font-bold text-blue-700">{summary.avgDuration || '0s'}</p>
//                                     <p className="text-xs text-blue-500 mt-1 font-medium">Avg per Call</p>
//                                 </div>
//                             </div>
//                             <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 space-y-1">
//                                 <div className="flex justify-between">
//                                     <span>Date range</span>
//                                     <span className="font-medium text-slate-700">{fromDate} → {toDate}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>Salesperson</span>
//                                     <span className="font-medium text-slate-700">{user?.name}</span>
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>

//                     {/* Call List Table */}
//                     {calls.length === 0 ? (
//                         <Card>
//                             <div className="text-center py-12">
//                                 <div className="text-5xl mb-4">📊</div>
//                                 <p className="text-lg font-bold text-slate-800">No Calls Found</p>
//                                 <p className="text-sm text-slate-400 mt-1">No call logs for the selected date range.</p>
//                             </div>
//                         </Card>
//                     ) : (
//                         <Card padding={false}>
//                             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <FileText size={16} className="text-blue-500" />
//                                     <p className="font-bold text-slate-800 text-sm">Call List ({calls.length})</p>
//                                 </div>
//                                 <Button
//                                     variant="outline" size="sm" icon={Download}
//                                     onClick={() => downloadCSV(calls, user?.name || 'My')}
//                                 >
//                                     Export CSV
//                                 </Button>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="w-full text-sm">
//                                     <thead>
//                                         <tr className="border-b border-slate-100 bg-slate-50/60">
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Duration</th>
//                                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Disposition</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50">
//                                         {calls.map((call, i) => (
//                                             <tr key={call._id || i} className="hover:bg-slate-50/50 transition-colors">
//                                                 <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
//                                                     {fmtDateTime(call.calledAt)}
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <p className="font-semibold text-slate-800 text-sm">{call.customerName || 'Unknown'}</p>
//                                                     <p className="text-xs text-slate-400">{call.customerNumber}</p>
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <span className={`text-xs font-semibold ${call.callType === 'Outgoing' ? 'text-blue-600' : 'text-violet-600'}`}>
//                                                         {call.callType === 'Outgoing' ? '↑ Outgoing' : '↓ Incoming'}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <StatusBadge status={call.callStatus} />
//                                                 </td>
//                                                 <td className="px-4 py-3 text-slate-600 font-medium text-sm">
//                                                     {fmtDuration(call.durationSeconds)}
//                                                 </td>
//                                                 <td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs">
//                                                     {call.disposition || '—'}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </Card>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }

// // ══════════════════════════════════════════════════════════
// //  SUPER ADMIN / GENERIC REPORT (existing view, kept intact)
// // ══════════════════════════════════════════════════════════
// function GenericReport() {
//     const [period, setPeriod] = useState('today');
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState(null);

//     const PERIOD_OPTIONS = [
//         { value: 'today', label: 'Today' },
//         { value: 'week',  label: 'This Week' },
//         { value: 'month', label: 'This Month' },
//     ];

//     const fetchReports = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await api.getReports(period);
//             setStats(res);
//         } catch { /* silent */ }
//         setLoading(false);
//     }, [period]);

//     useEffect(() => { fetchReports(); }, [fetchReports]);

//     const totalCalls = stats?.total ?? 0;
//     const connected  = stats?.connected ?? 0;
//     const missed     = stats?.missed    ?? 0;

//     return (
//         <div className="space-y-5">
//             <div>
//                 <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
//                 <p className="text-sm text-slate-400 mt-0.5">System-wide performance insights</p>
//             </div>
//             <Card>
//                 <div className="flex flex-wrap gap-2">
//                     {PERIOD_OPTIONS.map(opt => (
//                         <button
//                             key={opt.value}
//                             onClick={() => setPeriod(opt.value)}
//                             className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${period === opt.value ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
//                         >
//                             {opt.label}
//                         </button>
//                     ))}
//                 </div>
//             </Card>
//             {loading ? (
//                 <LoadingPage />
//             ) : (
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                     <StatCard label="Total Calls" value={totalCalls} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
//                     <StatCard label="Connected"   value={connected}  icon={CheckCircle} color="#10B981" bgColor="#ECFDF5" />
//                     <StatCard label="Missed"      value={missed}     icon={XCircle}    color="#F43F5E" bgColor="#FFF1F2" />
//                     <StatCard label="Connect Rate" value={`${stats?.connectRate ?? 0}%`} icon={TrendingUp} color="#8B5CF6" bgColor="#F5F3FF" />
//                 </div>
//             )}
//         </div>
//     );
// }

// // ══════════════════════════════════════════════════════════
// //  ROOT EXPORT — Role Router
// // ══════════════════════════════════════════════════════════
// export default function Reports() {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();

//     // Business user should use the dedicated Salesperson Reports page
//     useEffect(() => {
//         if (user?.role === 'business_user') {
//             navigate('/business/salesperson-reports', { replace: true });
//         }
//     }, [user, navigate]);

//     if (user?.role === 'salesperson')  return <SalespersonReport user={user} />;
//     if (user?.role === 'super_admin')  return <GenericReport />;

//     // business_user — redirecting (spinner while redirecting)
//     return <LoadingPage />;
// }


// src/pages/Reports.jsx
// ════════════════════════════════════════════════════════════
//  CHANGE SUMMARY (Old → New):
//
//  OLD GenericReport:
//   - Sirf /api/reports/summary call karta tha
//   - Sirf 4 static cards dikhata tha (Total, Connected, Missed, Rate)
//   - Koi chart nahi, koi agent breakdown nahi
//   - Koi business user / salesperson breakdown nahi
//
//  NEW AdminReport:
//   - /api/reports (full rich endpoint) call karta hai
//   - summary.cards, weeklyTrend, monthlySummary,
//     callDistribution, agentPerformance — sab use karta hai
//   - Weekly bar chart (pure CSS, no extra lib)
//   - Monthly trend line chart (pure SVG)
//   - Call distribution (Incoming/Outgoing/Missed)
//   - Agent/Salesperson performance table with connect-rate bar
//   - Date range filter (Today/Week/Month/Quarter)
//   - CSV export button
//   - Fully role-aware: super_admin sees all, business_user
//     sees only own team, salesperson uses SalespersonReport
// ════════════════════════════════════════════════════════════

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
    Phone, PhoneOff, TrendingUp, Clock, Users,
    Download, RefreshCcw, Filter, CheckCircle,
    XCircle, BarChart2, FileText, ChevronUp, ChevronDown,
} from 'lucide-react';
import { Card, StatCard, Button, LoadingPage, Badge, ProgressBar } from '../components/UI';

// ── Helpers ────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];

const fmtDuration = (sec) => {
    if (!sec || sec === 0) return '0s';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.round(sec % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

const fmtDateTime = (d) =>
    d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

function StatusBadge({ status }) {
    const colors = {
        Connected: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        Missed:    'bg-rose-50 text-rose-700 border border-rose-200',
        Rejected:  'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || colors.Rejected}`}>
            {status}
        </span>
    );
}

// ── CSV Export ─────────────────────────────────────────────
function downloadCSV(calls, name = 'Report') {
    if (!calls?.length) return;
    const headers = ['Date & Time', 'Customer Name', 'Phone', 'Type', 'Status', 'Duration', 'Disposition', 'Agent'];
    const rows = calls.map(c => [
        fmtDateTime(c.calledAt),
        c.customerName || '—',
        c.customerNumber || '—',
        c.callType || '—',
        c.callStatus || '—',
        fmtDuration(c.durationSeconds),
        c.disposition || '—',
        c.agent?.name || '—',
    ]);
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}-report-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Pure CSS Weekly Bar Chart ──────────────────────────────
function WeeklyBarChart({ data = [] }) {
    if (!data.length) return (
        <div className="flex items-center justify-center h-32 text-sm text-slate-400">
            No weekly data available
        </div>
    );
    const max = Math.max(...data.map(d => d.calls || 0), 1);
    const BAR_MAX_PX = 120;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        // <div className="flex items-end gap-2 h-40 px-2">
        // <div style={{ height: `${BAR_MAX_PX + 32}px` }}>
        <div className="flex items-end gap-2 px-2" style={{ height: `${BAR_MAX_PX + 32}px` }}>
            {data.map((d, i) => {
                const h = Math.max(4, Math.round((d.calls / max) * 100));
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {d.calls} calls
                        </div>
                        {/* <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                            <div
                                className="w-full rounded-t-lg bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                                style={{ height: `${barH}px` }}
                            />
                        </div> */}
                        <div className="w-6 flex flex-col justify-end">
                            <div
                                className="w-full rounded-t-lg bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                                style={{ height: `${h}px` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">{days[i] || d.week || `D${i+1}`}</p>
                    </div>
                );
            })}
        </div>
    );
}

// ── SVG Monthly Trend Line ─────────────────────────────────
function MonthlyLineChart({ data = [] }) {
    if (!data.length) return (
        <div className="flex items-center justify-center h-32 text-sm text-slate-400">
            No monthly data available
        </div>
    );

    const W = 400, H = 120, PAD = 20;
    const max = Math.max(...data.map(d => d.total || 0), 1);
    const pts = data.map((d, i) => ({
        x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
        y: H - PAD - ((d.total / max) * (H - PAD * 2)),
        d,
    }));

    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill="url(#lineGrad)" />
            <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="3" fill="#3B82F6" />
                    <text x={p.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">{p.d.month}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Donut Chart (SVG) ──────────────────────────────────────
function DonutChart({ connected = 0, total = 1 }) {
    const rate = total > 0 ? Math.round((connected / total) * 100) : 0;
    const color = rate >= 60 ? '#10B981' : rate >= 40 ? '#F59E0B' : '#F43F5E';
    return (
        <div className="relative w-28 h-28 mx-auto">
            <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={color} strokeWidth="4"
                    strokeDasharray={`${rate} ${100 - rate}`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-slate-900">{rate}%</p>
                <p className="text-[10px] text-slate-400">Connected</p>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════
//  SALESPERSON REPORT (unchanged from original)
// ══════════════════════════════════════════════════════════
function SalespersonReport({ user }) {
    const [fromDate, setFromDate] = useState(today());
    const [toDate,   setToDate]   = useState(today());
    const [loading,  setLoading]  = useState(true);
    const [data,     setData]     = useState(null);
    const [error,    setError]    = useState('');

    const fetchReport = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await api.getMyCallLogReport({ fromDate, toDate });
            if (res?.summary) setData(res);
            else setError(res?.message || 'Failed to load report.');
        } catch { setError('Cannot connect to server.'); }
        setLoading(false);
    }, [fromDate, toDate]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const summary = data?.summary || {};
    const calls   = data?.calls   || [];

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">My Call Report</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Your personal call performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" icon={Download} onClick={() => downloadCSV(calls, user?.name || 'My')} disabled={!calls.length}>
                        Download CSV
                    </Button>
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchReport}>Refresh</Button>
                </div>
            </div>

            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Range</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
                        <input type="date" value={fromDate} max={toDate} onChange={e => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
                        <input type="date" value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </Card>

            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                    <p className="text-rose-700 text-sm font-medium">⚠️ {error}</p>
                    <button onClick={fetchReport} className="text-rose-600 font-semibold text-sm ml-4 hover:underline">Retry →</button>
                </div>
            )}

            {loading ? <LoadingPage /> : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Calls" value={summary.total ?? 0} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                        <StatCard label="Connected" value={summary.connected ?? 0} icon={CheckCircle} color="#10B981" bgColor="#ECFDF5" />
                        <StatCard label="Not Connected" value={summary.notConnected ?? 0} icon={XCircle} color="#F43F5E" bgColor="#FFF1F2" />
                        <StatCard label="Total Duration" value={summary.totalDuration || '0s'} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4">
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                </div>
                                <p className="font-bold text-slate-800">Connection Rate</p>
                            </div>
                            <DonutChart connected={summary.connected ?? 0} total={summary.total ?? 0} />
                            <div className="space-y-1.5 text-sm mt-4">
                                <div className="flex justify-between"><span className="text-slate-500">Connected</span><span className="font-semibold text-emerald-600">{summary.connected ?? 0}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Missed</span><span className="font-semibold text-rose-600">{summary.missed ?? 0}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Rejected</span><span className="font-semibold text-amber-600">{summary.rejected ?? 0}</span></div>
                            </div>
                        </Card>

                        <Card className="lg:col-span-2">
                            <p className="font-bold text-slate-800 mb-4">Duration Summary</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-purple-700">{summary.totalDuration || '0s'}</p>
                                    <p className="text-xs text-purple-500 mt-1 font-medium">Total Talk Time</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-blue-700">{summary.avgDuration || '0s'}</p>
                                    <p className="text-xs text-blue-500 mt-1 font-medium">Avg per Call</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 space-y-1">
                                <div className="flex justify-between"><span>Date range</span><span className="font-medium text-slate-700">{fromDate} → {toDate}</span></div>
                                <div className="flex justify-between"><span>Salesperson</span><span className="font-medium text-slate-700">{user?.name}</span></div>
                            </div>
                        </Card>
                    </div>

                    {calls.length === 0 ? (
                        <Card><div className="text-center py-12"><div className="text-5xl mb-4">📊</div><p className="text-lg font-bold text-slate-800">No Calls Found</p><p className="text-sm text-slate-400 mt-1">No call logs for the selected date range.</p></div></Card>
                    ) : (
                        <Card padding={false}>
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2"><FileText size={16} className="text-blue-500" /><p className="font-bold text-slate-800 text-sm">Call List ({calls.length})</p></div>
                                <Button variant="outline" size="sm" icon={Download} onClick={() => downloadCSV(calls, user?.name || 'My')}>Export CSV</Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            {['Date & Time', 'Customer', 'Type', 'Status', 'Duration', 'Disposition'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {calls.map((call, i) => (
                                            <tr key={call._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{fmtDateTime(call.calledAt)}</td>
                                                <td className="px-4 py-3"><p className="font-semibold text-slate-800 text-sm">{call.customerName || 'Unknown'}</p><p className="text-xs text-slate-400">{call.customerNumber}</p></td>
                                                <td className="px-4 py-3"><span className={`text-xs font-semibold ${call.callType === 'Outgoing' ? 'text-blue-600' : 'text-violet-600'}`}>{call.callType === 'Outgoing' ? '↑ Outgoing' : '↓ Incoming'}</span></td>
                                                <td className="px-4 py-3"><StatusBadge status={call.callStatus} /></td>
                                                <td className="px-4 py-3 text-slate-600 font-medium text-sm">{fmtDuration(call.durationSeconds)}</td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">{call.disposition || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════
//  ADMIN / BUSINESS USER — PROFESSIONAL REPORT
//
//  OLD CODE (GenericReport) jo replace ho raha hai:
//  ─────────────────────────────────────────────
//  function GenericReport() {
//      const [period, setPeriod] = useState('today');
//      const [loading, setLoading] = useState(true);
//      const [stats, setStats] = useState(null);
//      ...
//      const fetchReports = useCallback(async () => {
//          setLoading(true);
//          try {
//              const res = await api.getReports(period);  // ← sirf /api/reports/summary
//              setStats(res);
//          } catch { /* silent */ }
//          setLoading(false);
//      }, [period]);
//      ...
//      // SIRF 4 StatCards dikhata tha — koi chart nahi, koi agents nahi
//      return (
//          <div className="space-y-5">
//              ...4 cards...
//          </div>
//      );
//  }
//
//  NEW CODE (AdminReport):
//  ─────────────────────────────────────────────
//  - /api/reports?range=week call karta hai (full data)
//  - summary.cards → KPI cards with change%
//  - weeklyTrend   → Bar chart (7 days)
//  - monthlySummary→ Line chart (6 months)
//  - callDistribution → Incoming/Outgoing/Missed breakdown
//  - agentPerformance → Agent table with connect-rate bar
// ══════════════════════════════════════════════════════════
function AdminReport({ user }) {
    const RANGE_OPTIONS = [
        { value: 'today',   label: 'Today' },
        { value: 'week',    label: 'This Week' },
        { value: 'month',   label: 'This Month' },
        { value: 'quarter', label: 'Last 3 Months' },
    ];

    const [range, setRange]               = useState('week');
    const [loading, setLoading]           = useState(true);
    const [summary, setSummary]           = useState([]);
    const [weeklyTrend, setWeeklyTrend]   = useState([]);
    const [monthly, setMonthly]           = useState([]);
    const [distribution, setDistribution] = useState([]);
    const [agents, setAgents]             = useState([]);
    const [error, setError]               = useState('');
    const [exportLoading, setExportLoading] = useState(false);

    // For CSV: also fetch call logs
    const [callLogs, setCallLogs] = useState([]);

    const isAdmin    = user?.role === 'super_admin';
    const isBusiness = user?.role === 'business_user';

    // ── Fetch all report data ──────────────────────────────
    const fetchReports = useCallback(async () => {
        setLoading(true); setError('');
        try {
            // ✅ CORRECT: api.js ka method use karo — sahi URL + auth headers automatic
            const res = await api.getFullReport(range);

            if (res?.summary)          setSummary(res.summary || []);
            if (res?.weeklyTrend)      setWeeklyTrend(res.weeklyTrend || []);
            if (res?.monthlySummary)   setMonthly(res.monthlySummary || []);
            if (res?.callDistribution) setDistribution(res.callDistribution || []);
            if (res?.agentPerformance) setAgents(res.agentPerformance || []);

            // CSV ke liye call logs bhi fetch karo
            try {
                const logsRes = await api.getCallLogs({ limit: 500, sortField: 'calledAt', sortDir: 'desc' });
                setCallLogs(logsRes?.logs || []);
            } catch { /* non-critical */ }

        } catch (e) {
            console.error(e);
            setError('Failed to load report data. Please check your connection.');
        }
        setLoading(false);
    }, [range]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    // ── Derived KPI values from summary cards ─────────────
    // Backend summary is an array of card objects:
    // [{ title: "Total Calls", value: "21", change: "+5%", up: true }, ...]
    const kpiMap = {};
    (Array.isArray(summary) ? summary : []).forEach(s => {
        kpiMap[s.title] = s;
    });

    const totalCallsCard  = kpiMap['Total Calls']    || {};
    const connectedCard   = kpiMap['Connected Calls']  || {};
    const missedCard      = kpiMap['Missed Calls']      || {};
    // const connectRateCard = kpiMap['Connect Rate']   || {};

    // Total/connected numbers for donut chart
    const totalNum    = parseInt(totalCallsCard.value)  || 0;
    const connectedNum = parseInt(connectedCard.value)  || 0;

    const connectRateVal  = totalNum > 0
        ? Math.round((connectedNum / totalNum) * 100) : 0;
    const connectRateCard = { value: `${connectRateVal}%`, change: null, up: connectRateVal >= 50 };

    

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {isAdmin ? 'Platform-wide performance insights' : 'Your team performance insights'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary" size="sm" icon={Download}
                        onClick={() => downloadCSV(callLogs, isAdmin ? 'Platform' : 'Team')}
                        disabled={!callLogs.length}
                    >
                        Export CSV
                    </Button>
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchReports}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ── Range Selector ─────────────────────────── */}
            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Range</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {RANGE_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setRange(opt.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                range === opt.value
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* ── Error ──────────────────────────────────── */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                    <p className="text-rose-700 text-sm font-medium">⚠️ {error}</p>
                    <button onClick={fetchReports} className="text-rose-600 font-semibold text-sm ml-4 hover:underline">Retry →</button>
                </div>
            )}

            {loading ? <LoadingPage /> : (
                <>
                    {/* ── KPI Cards ──────────────────────────── */}
                    {/*
                      OLD: Sirf 4 plain StatCards the, koi change% nahi tha
                      NEW: Backend se summary.cards aata hai jisme change% bhi hai
                    */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { card: totalCallsCard,  label: 'Total Calls',    icon: Phone,        color: '#3B82F6', bg: '#EFF6FF' },
                            { card: connectedCard,   label: 'Connected',      icon: CheckCircle,  color: '#10B981', bg: '#ECFDF5' },
                            { card: missedCard,      label: 'Missed',         icon: XCircle,      color: '#F43F5E', bg: '#FFF1F2' },
                            { card: connectRateCard, label: 'Connect Rate',   icon: TrendingUp,   color: '#8B5CF6', bg: '#F5F3FF' },
                        ].map(({ card, label, icon, color, bg }) => (
                            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                                        {React.createElement(icon, { size: 20, style: { color } })}
                                    </div>
                                    {card.change && (
                                        <span className={`text-xs font-bold flex items-center gap-0.5 ${card.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {card.up ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            {card.change}
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{card.value ?? '—'}</p>
                                <p className="text-xs text-slate-400 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Charts Row ─────────────────────────── */}
                    {/*
                      OLD: Koi chart nahi tha
                      NEW: Weekly bar chart + Connection rate donut
                    */}
                    <div className="grid lg:grid-cols-3 gap-5">
                        {/* Weekly Trend Bar */}
                        <Card className="lg:col-span-2" padding={false}>
                            <div className="p-5 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <BarChart2 size={16} className="text-blue-500" />
                                    <p className="font-bold text-slate-800 text-sm">7-Day Call Volume</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <WeeklyBarChart data={weeklyTrend} />
                            </div>
                        </Card>

                        {/* Donut + Distribution */}
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                </div>
                                <p className="font-bold text-slate-800">Connection Rate</p>
                            </div>
                            <DonutChart connected={connectedNum} total={totalNum} />
                            <div className="space-y-2 mt-4">
                                {distribution.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                                            <span className="text-slate-600">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-700">{d.value}</span>
                                            <span className="text-xs text-slate-400">({d.percent}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* ── Monthly Trend Line ─────────────────── */}
                    {/*
                      OLD: Koi monthly chart nahi tha
                      NEW: 6-month SVG line chart
                    */}
                    {monthly.length > 0 && (
                        <Card padding={false}>
                            <div className="p-5 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500" />
                                    <p className="font-bold text-slate-800 text-sm">6-Month Trend</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <MonthlyLineChart data={monthly} />
                                <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded-sm bg-blue-500" /> Total Calls</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* ── Agent / Salesperson Performance Table ─ */}
                    {/*
                      OLD: Koi agent table nahi tha
                      NEW: Full table with connect-rate progress bar
                           Backend agentPerformance se data aata hai:
                           { _id, name, email, calls, connected, missed, rate, avgDuration }
                    */}
                    {agents.length > 0 && (
                        <Card padding={false}>
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-violet-500" />
                                    <p className="font-bold text-slate-800 text-sm">
                                        {isAdmin ? 'All Salesperson Performance' : 'My Team Performance'}
                                    </p>
                                    <span className="ml-auto text-xs text-slate-400">{agents.length} agents</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Agent</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Connected</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Missed</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell" style={{ minWidth: 140 }}>Connect Rate</th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Avg Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {agents.map((ag, i) => (
                                            <tr key={ag._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-slate-300 font-bold w-5 shrink-0">#{i+1}</span>
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                            style={{ backgroundColor: ['#3B82F6','#8B5CF6','#10B981','#F43F5E','#F59E0B','#06B6D4'][i % 6] }}
                                                        >
                                                            {(ag.name || ag.avatar || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{ag.name}</p>
                                                            <p className="text-xs text-slate-400">{ag.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="text-sm font-bold text-blue-600">{ag.calls ?? 0}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="text-sm font-bold text-emerald-600">{ag.connected ?? 0}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="text-sm font-bold text-rose-500">{ag.missed ?? 0}</span>
                                                </td>
                                                <td className="px-5 py-3.5 hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all"
                                                                style={{
                                                                    width: `${ag.rate ?? 0}%`,
                                                                    backgroundColor: (ag.rate ?? 0) >= 60 ? '#10B981' : (ag.rate ?? 0) >= 40 ? '#F59E0B' : '#F43F5E',
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-500 w-9 shrink-0">
                                                            {ag.rate ?? 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center text-sm text-slate-500 hidden md:table-cell">
                                                    {ag.avgDuration || '0s'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* Empty state */}
                    {agents.length === 0 && totalNum === 0 && (
                        <Card>
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4">📊</div>
                                <p className="text-lg font-bold text-slate-800">No Data Available</p>
                                <p className="text-sm text-slate-400 mt-1">No call records found for the selected period.</p>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════
//  ROOT EXPORT — Role Router (unchanged logic)
// ══════════════════════════════════════════════════════════
export default function Reports() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'business_user') {
            navigate('/business/salesperson-reports', { replace: true });
        }
    }, [user, navigate]);

    if (user?.role === 'salesperson') return <SalespersonReport user={user} />;
    if (user?.role === 'super_admin')  return <AdminReport user={user} />;
    if (user?.role === 'business_user') return <AdminReport user={user} />;

    return <LoadingPage />;
}