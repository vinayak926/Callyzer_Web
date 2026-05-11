// src/pages/business/SalespersonReports.jsx
// Business User only.
// Shows list of salespersons → click one → see their call report with date filter + download.

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
    Users, Phone, CheckCircle, XCircle, Clock, TrendingUp,
    Download, RefreshCcw, Filter, ArrowLeft, FileText, User,
} from 'lucide-react';
import { Card, StatCard, Button, LoadingPage, Badge } from '../../components/UI';

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

function downloadCSV(calls, salespersonName = 'Salesperson') {
    if (!calls.length) return;
    const headers = ['Date & Time', 'Customer Name', 'Phone', 'Type', 'Status', 'Duration', 'Disposition', 'Notes'];
    const rows = calls.map(c => [
        fmtDateTime(c.calledAt),
        c.customerName || '—',
        c.customerNumber || '—',
        c.callType || '—',
        c.callStatus || '—',
        fmtDuration(c.durationSeconds),
        c.disposition || '—',
        (c.notes || '').replace(/,/g, ';'),
    ]);
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${salespersonName}-report-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── Avatar initial ─────────────────────────────────────────
function Avatar({ name }) {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4'];
    const idx    = (name?.charCodeAt(0) || 0) % colors.length;
    return (
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: colors[idx] }}
        >
            {(name || 'S').charAt(0).toUpperCase()}
        </div>
    );
}

// ══════════════════════════════════════════════════════════
//  SALESPERSON DETAIL REPORT VIEW
// ══════════════════════════════════════════════════════════
function SalespersonDetailReport({ salesperson, onBack }) {
    const [fromDate, setFromDate] = useState(today());
    const [toDate,   setToDate]   = useState(today());
    const [loading,  setLoading]  = useState(true);
    const [data,     setData]     = useState(null);
    const [error,    setError]    = useState('');

    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.getSalespersonCallReport(salesperson.id, { fromDate, toDate });
            if (res?.summary) {
                setData(res);
            } else {
                setError(res?.message || 'Failed to load report.');
            }
        } catch {
            setError('Cannot connect to server.');
        }
        setLoading(false);
    }, [salesperson.id, fromDate, toDate]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const summary = data?.summary || {};
    const calls   = data?.calls   || [];

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <Avatar name={salesperson.name} />
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{salesperson.name}</h2>
                        <p className="text-sm text-slate-400">{salesperson.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary" size="sm" icon={Download}
                        onClick={() => downloadCSV(calls, salesperson.name)}
                        disabled={!calls.length}
                    >
                        Download CSV
                    </Button>
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchReport}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Date Filter */}
            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Range</span>
                    <span className="ml-auto text-xs text-slate-400">(Default: Today)</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
                        <input
                            type="date" value={fromDate} max={toDate}
                            onChange={e => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
                        <input
                            type="date" value={toDate} min={fromDate}
                            onChange={e => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </Card>

            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                    <p className="text-rose-700 text-sm font-medium">⚠️ {error}</p>
                    <button onClick={fetchReport} className="text-rose-600 font-semibold text-sm ml-4 hover:underline">Retry →</button>
                </div>
            )}

            {loading ? (
                <LoadingPage />
            ) : (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Calls"   value={summary.total ?? 0}          icon={Phone}       color="#3B82F6" bgColor="#EFF6FF" />
                        <StatCard label="Connected"     value={summary.connected ?? 0}       icon={CheckCircle} color="#10B981" bgColor="#ECFDF5" />
                        <StatCard label="Not Connected" value={summary.notConnected ?? 0}    icon={XCircle}     color="#F43F5E" bgColor="#FFF1F2" />
                        <StatCard label="Total Duration" value={summary.totalDuration || '0s'} icon={Clock}     color="#8B5CF6" bgColor="#F5F3FF" />
                    </div>

                    {/* Rate + Duration */}
                    <div className="grid lg:grid-cols-3 gap-4">
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                </div>
                                <p className="font-bold text-slate-800">Connection Rate</p>
                            </div>
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-28 h-28">
                                    <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                                        <circle
                                            cx="18" cy="18" r="15.9" fill="none"
                                            stroke={summary.connectRate >= 50 ? '#10B981' : '#F43F5E'}
                                            strokeWidth="4"
                                            strokeDasharray={`${summary.connectRate ?? 0} ${100 - (summary.connectRate ?? 0)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-2xl font-bold text-slate-900">{summary.connectRate ?? 0}%</p>
                                        <p className="text-[10px] text-slate-400">Rate</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-sm">
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
                                <div className="flex justify-between">
                                    <span>Date range</span>
                                    <span className="font-medium text-slate-700">{fromDate} → {toDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Salesperson</span>
                                    <span className="font-medium text-slate-700">{salesperson.name}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Call Table */}
                    {calls.length === 0 ? (
                        <Card>
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📊</div>
                                <p className="text-lg font-bold text-slate-800">No Calls Found</p>
                                <p className="text-sm text-slate-400 mt-1">No call logs for the selected date range.</p>
                            </div>
                        </Card>
                    ) : (
                        <Card padding={false}>
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-blue-500" />
                                    <p className="font-bold text-slate-800 text-sm">Call List ({calls.length})</p>
                                </div>
                                <Button
                                    variant="outline" size="sm" icon={Download}
                                    onClick={() => downloadCSV(calls, salesperson.name)}
                                >
                                    Export CSV
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Duration</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Disposition</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {calls.map((call, i) => (
                                            <tr key={call._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{fmtDateTime(call.calledAt)}</td>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-slate-800 text-sm">{call.customerName || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-400">{call.customerNumber}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs font-semibold ${call.callType === 'Outgoing' ? 'text-blue-600' : 'text-violet-600'}`}>
                                                        {call.callType === 'Outgoing' ? '↑ Outgoing' : '↓ Incoming'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3"><StatusBadge status={call.callStatus} /></td>
                                                <td className="px-4 py-3 text-slate-600 font-medium">{fmtDuration(call.durationSeconds)}</td>
                                                <td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs">{call.disposition || '—'}</td>
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
//  SALESPERSON LIST VIEW (landing view)
// ══════════════════════════════════════════════════════════
function SalespersonList({ onSelect }) {
    const [salespersons, setSalespersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await api.getMySalespersons();
                setSalespersons(res?.salespersons || []);
            } catch {
                setError('Failed to load team members.');
            }
            setLoading(false);
        })();
    }, []);

    if (loading) return <LoadingPage />;

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Salesperson Reports</h2>
                <p className="text-sm text-slate-400 mt-0.5">Click a salesperson to view their call report</p>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
                    <p className="text-rose-700 text-sm font-medium">⚠️ {error}</p>
                </div>
            )}

            {salespersons.length === 0 && !error && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">👥</div>
                        <p className="text-lg font-bold text-slate-800">No Salespersons Found</p>
                        <p className="text-sm text-slate-400 mt-1">Add salespersons from My Team page first.</p>
                    </div>
                </Card>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {salespersons.map((sp) => (
                    <button
                        key={sp._id}
                        onClick={() => onSelect({ id: sp._id, name: sp.name, email: sp.email })}
                        className="text-left bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                                style={{ backgroundColor: '#3B82F6' }}
                            >
                                {(sp.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{sp.name}</p>
                                <p className="text-xs text-slate-400 truncate">{sp.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sp.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sp.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {sp.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-blue-500 font-semibold group-hover:underline">View Report →</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════
//  ROOT EXPORT
// ══════════════════════════════════════════════════════════
export default function SalespersonReports() {
    const { user } = useContext(AuthContext);
    const [selectedSalesperson, setSelectedSalesperson] = useState(null);

    if (user?.role !== 'business_user') {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">Access denied. Business User account required.</p>
            </div>
        );
    }

    if (selectedSalesperson) {
        return (
            <SalespersonDetailReport
                salesperson={selectedSalesperson}
                onBack={() => setSelectedSalesperson(null)}
            />
        );
    }

    return <SalespersonList onSelect={setSelectedSalesperson} />;
}