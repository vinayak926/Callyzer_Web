import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtDuration = (s) => {
    if (!s) return '0m';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
const getDateRange = (period) => {
    const now = new Date();
    const to  = now.toISOString().split('T')[0];
    let from;
    if      (period === 'today')   { from = to; }
    else if (period === 'week')    { const d = new Date(now); d.setDate(d.getDate() - 6);   from = d.toISOString().split('T')[0]; }
    else if (period === 'month')   { const d = new Date(now); d.setDate(1);                  from = d.toISOString().split('T')[0]; }
    else                           { const d = new Date(now); d.setMonth(d.getMonth() - 3); from = d.toISOString().split('T')[0]; }
    return { dateFrom: from, dateTo: to };
};
const buildDailyBuckets = (logs, period) => {
    const buckets = {};
    const now  = new Date();
    const days = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 90;
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        buckets[key] = { date: key, total: 0, connected: 0, missed: 0, rejected: 0 };
    }
    logs.forEach(log => {
        const key = log.calledAt ? log.calledAt.split('T')[0] : null;
        if (key && buckets[key]) {
            buckets[key].total++;
            if (log.callStatus === 'Connected') buckets[key].connected++;
            else if (log.callStatus === 'Missed') buckets[key].missed++;
            else if (log.callStatus === 'Rejected') buckets[key].rejected++;
        }
    });
    return Object.values(buckets);
};

const PERIODS = [
    { key: 'today',   label: 'Today',      icon: '📅' },
    { key: 'week',    label: 'This Week',  icon: '📆' },
    { key: 'month',   label: 'This Month', icon: '📊' },
    { key: 'quarter', label: 'Last 3M',    icon: '📈' },
];

// Mini horizontal bar
function MiniBar({ value, max, color }) {
    const pct = Math.round((value / Math.max(max, 1)) * 100);
    return (
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
    );
}

export default function Reports() {
    const [period, setPeriod]       = useState('month');
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError]         = useState('');
    const [exporting, setExporting] = useState(false);
    const [hourlyData, setHourlyData] = useState([]);
    const [peakHour, setPeakHour]   = useState(null);
    const [agentReports, setAgentReports] = useState([]);

    const fetchData = useCallback(async () => {
        setError('');
        try {
            const { dateFrom, dateTo } = getDateRange(period);
            const [logsRes, hourlyRes, teamRes] = await Promise.allSettled([
                api.getCallLogs({ dateFrom, dateTo, limit: 500, sortField: 'calledAt', sortDir: 'asc' }),
                api.getHourlyReport(new Date().toISOString().split('T')[0]),
                api.getTeamCallStats(),
            ]);
            if (logsRes.status === 'fulfilled') {
                const r = logsRes.value;
                setLogs(r?.logs || (Array.isArray(r) ? r : []));
            }
            if (hourlyRes.status === 'fulfilled') {
                const h = hourlyRes.value;
                setHourlyData(h?.workHours || []);
                setPeakHour(h?.peakHour || null);
            }
            if (teamRes.status === 'fulfilled') {
                setAgentReports(teamRes.value?.agents || []);
            }
        } catch { setError('Cannot connect to server.'); }
        finally { setLoading(false); setRefreshing(false); }
    }, [period]);

    useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);

    // ── Computed ──────────────────────────────────────────
    const total     = logs.length;
    const connected = logs.filter(l => l.callStatus === 'Connected').length;
    const missed    = logs.filter(l => l.callStatus === 'Missed').length;
    const rejected  = logs.filter(l => l.callStatus === 'Rejected').length;
    const outgoing  = logs.filter(l => l.callType === 'Outgoing').length;
    const incoming  = logs.filter(l => l.callType === 'Incoming').length;
    const connRate  = total ? Math.round((connected / total) * 100) : 0;
    const totalDur  = logs.reduce((s, l) => s + (l.durationSeconds || 0), 0);
    const avgDur    = total ? Math.round(totalDur / total) : 0;

    const dispositions = {};
    logs.forEach(l => { if (l.disposition) dispositions[l.disposition] = (dispositions[l.disposition] || 0) + 1; });
    const dispEntries = Object.entries(dispositions).sort((a, b) => b[1] - a[1]);

    const allBuckets   = buildDailyBuckets(logs, period);
    const step         = period === 'quarter' ? 7 : period === 'month' ? 3 : 1;
    const chartBuckets = allBuckets.filter((_, i, arr) => i % step === 0 || i === arr.length - 1);
    const maxBucket    = Math.max(...allBuckets.map(b => b.total), 1);

    const summaryCards = [
        { title: 'Total Calls',    value: String(total),              color: '#6366f1', icon: '📞' },
        { title: 'Connected',      value: String(connected),          color: '#22c55e', icon: '✅' },
        { title: 'Missed',         value: String(missed),             color: '#ef4444', icon: '❌' },
        { title: 'Connect Rate',   value: `${connRate}%`,             color: '#3b82f6', icon: '📈' },
        { title: 'Avg Duration',   value: fmtDuration(avgDur),        color: '#8b5cf6', icon: '⏱' },
        { title: 'Total Duration', value: fmtDuration(totalDur),      color: '#f59e0b', icon: '🕐' },
    ];

    const periodLabel     = PERIODS.find(p => p.key === period)?.label || '';
    const { dateFrom, dateTo } = getDateRange(period);

    // ── Export CSV ────────────────────────────────────────
    const handleExportCSV = () => {
        if (total === 0) return;
        const headers = ['Customer Name', 'Phone', 'Type', 'Status', 'Duration', 'Disposition', 'Date'];
        const rows = logs.map(l => [
            l.customerName || '—', l.customerNumber || '—', l.callType || '—',
            l.callStatus || '—', fmtDuration(l.durationSeconds),
            l.disposition || '—',
            l.calledAt ? new Date(l.calledAt).toLocaleDateString('en-IN') : '—',
        ]);
        const csv  = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `report-${period}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-3 bg-gray-50">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading reports...</p>
        </div>
    );

    return (
        <div className="min-h-full bg-gray-100">
            {/* Header */}
            <div className="bg-slate-900 px-4 lg:px-6 py-6 rounded-b-3xl">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <div>
                        <h2 className="text-xl font-extrabold text-white">Reports & Analytics</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Track your call performance metrics</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">📊</div>
                </div>
            </div>

            <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">
                {/* Period Selector */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Period</p>
                    <div className="flex flex-wrap gap-2">
                        {PERIODS.map(p => (
                            <button key={p.key} onClick={() => setPeriod(p.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${period === p.key ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                                <span>{p.icon}</span> {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} disabled={total === 0} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-2xl shadow-sm text-sm">
                        ⬇️ Download CSV
                    </button>
                    <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-sm text-sm">
                        🖨️ Print Report
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 flex items-center justify-between">
                        <p className="text-red-600 text-sm">⚠️ {error}</p>
                        <button onClick={fetchData} className="text-red-600 font-bold text-sm ml-4">Retry →</button>
                    </div>
                )}

                {/* Empty */}
                {!error && total === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                        <div className="text-5xl mb-4">📊</div>
                        <p className="text-lg font-bold text-gray-800">No Calls Found</p>
                        <p className="text-sm text-gray-500 mt-1">No call logs for "{periodLabel}"</p>
                        <p className="text-xs text-gray-400 mt-1">Select a different period or add some calls first</p>
                    </div>
                )}

                {total > 0 && (
                    <>
                        {/* Summary Cards */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                <h3 className="font-bold text-gray-900 text-sm">Key Metrics — {periodLabel}</h3>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {summaryCards.map((card, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm" style={{ borderTop: `3px solid ${card.color}` }}>
                                        <div className="text-xl mb-2">{card.icon}</div>
                                        <p className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-1">{card.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call Type Split */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                <h3 className="font-bold text-gray-900 text-sm">Call Type Split</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                                {[{ label: 'Outgoing', value: outgoing, color: '#6366f1' }, { label: 'Incoming', value: incoming, color: '#3b82f6' }].map(item => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-semibold text-gray-700 w-20">{item.label}</span>
                                        <MiniBar value={item.value} max={total} color={item.color} />
                                        <span className="text-sm font-bold text-gray-700 w-8 text-right">{item.value}</span>
                                        <span className="text-xs text-gray-400 w-10 text-right">{total ? Math.round((item.value / total) * 100) : 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Distribution */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                <h3 className="font-bold text-gray-900 text-sm">Call Status Distribution</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                                {[
                                    { label: 'Connected', value: connected, color: '#22c55e' },
                                    { label: 'Missed',    value: missed,    color: '#ef4444' },
                                    { label: 'Rejected',  value: rejected,  color: '#f59e0b' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-semibold text-gray-700 w-20">{item.label}</span>
                                        <MiniBar value={item.value} max={total} color={item.color} />
                                        <span className="text-sm font-bold text-gray-700 w-8 text-right">{item.value}</span>
                                        <span className="text-xs text-gray-400 w-10 text-right">{total ? Math.round((item.value / total) * 100) : 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Trend */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                <h3 className="font-bold text-gray-900 text-sm">Daily Trend</h3>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm overflow-x-auto">
                                <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
                                    {[['Connected', '#22c55e'], ['Missed', '#ef4444'], ['Rejected', '#f59e0b']].map(([l, c]) => (
                                        <div key={l} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                                            <span className="text-xs text-gray-500 font-medium">{l}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-end gap-2 min-w-0 overflow-x-auto pb-2" style={{ minHeight: '120px' }}>
                                    {chartBuckets.map((b, i) => {
                                        const BAR_H   = 80;
                                        const connH   = Math.round((b.connected / maxBucket) * BAR_H);
                                        const missH   = Math.round((b.missed    / maxBucket) * BAR_H);
                                        const rejH    = Math.round((b.rejected  / maxBucket) * BAR_H);
                                        const label   = period === 'today' ? 'Today' :
                                            period === 'week' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(b.date).getDay()] :
                                            b.date.slice(5);
                                        return (
                                            <div key={i} className="flex flex-col items-center min-w-[32px]">
                                                <span className="text-xs text-gray-400 mb-1 font-medium" style={{ minHeight: '16px' }}>{b.total || ''}</span>
                                                <div className="flex items-end gap-0.5" style={{ height: BAR_H }}>
                                                    {connH > 0 && <div className="w-2 rounded-t" style={{ height: connH, backgroundColor: '#22c55e' }} />}
                                                    {missH > 0 && <div className="w-2 rounded-t" style={{ height: missH, backgroundColor: '#ef4444' }} />}
                                                    {rejH  > 0 && <div className="w-2 rounded-t" style={{ height: rejH,  backgroundColor: '#f59e0b' }} />}
                                                    {b.total === 0 && <div className="w-2 rounded-t bg-gray-200" style={{ height: 4 }} />}
                                                </div>
                                                <span className="text-xs text-gray-400 mt-1">{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Disposition Breakdown */}
                        {dispEntries.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                    <h3 className="font-bold text-gray-900 text-sm">Disposition Breakdown</h3>
                                </div>
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                                    {dispEntries.map(([label, count], i) => {
                                        const cols  = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4'];
                                        const color = cols[i % cols.length];
                                        return (
                                            <div key={label} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                                <span className="text-sm font-semibold text-gray-700 w-28 truncate">{label}</span>
                                                <MiniBar value={count} max={total} color={color} />
                                                <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                                                <span className="text-xs text-gray-400 w-10 text-right">{Math.round((count / total) * 100)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Today's Hourly Breakdown */}
                        {hourlyData.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                    <h3 className="font-bold text-gray-900 text-sm">Today's Hourly Breakdown</h3>
                                </div>
                                {peakHour && peakHour.total > 0 && (
                                    <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 mb-3">
                                        <span className="text-3xl">🔥</span>
                                        <div>
                                            <p className="font-extrabold text-amber-800">Peak Hour: {peakHour.label}</p>
                                            <p className="text-sm text-amber-700">{peakHour.total} calls · {peakHour.connected} connected</p>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold">Hour</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">Total</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">✅</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">❌</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {hourlyData.filter(h => h.total > 0).map((h, i) => {
                                                const rate   = h.total > 0 ? Math.round((h.connected / h.total) * 100) : 0;
                                                const isPeak = peakHour && peakHour.hour === h.hour;
                                                return (
                                                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${isPeak ? '!bg-amber-50' : ''}`}>
                                                        <td className="px-4 py-2.5 font-semibold text-gray-800 text-sm">
                                                            {isPeak && <span className="mr-1.5">🔥</span>}{h.label}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center font-bold text-gray-800">{h.total}</td>
                                                        <td className="px-4 py-2.5 text-center font-semibold text-green-600">{h.connected}</td>
                                                        <td className="px-4 py-2.5 text-center font-semibold text-red-500">{h.missed}</td>
                                                        <td className={`px-4 py-2.5 text-center font-bold ${rate >= 50 ? 'text-green-600' : 'text-red-500'}`}>{rate}%</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Team Performance */}
                        {agentReports.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                    <h3 className="font-bold text-gray-900 text-sm">Today's Team Performance</h3>
                                </div>
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold">Salesperson</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">Calls</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">✅</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {agentReports.map((agent, i) => {
                                                const rate = agent.totalCalls > 0 ? Math.round((agent.connectedCalls / agent.totalCalls) * 100) : 0;
                                                return (
                                                    <tr key={agent._id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-indigo-600">{(agent.name || 'S').charAt(0).toUpperCase()}</span>
                                                                </div>
                                                                <span className="font-semibold text-gray-800">{agent.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-bold text-gray-800">{agent.totalCalls}</td>
                                                        <td className="px-4 py-3 text-center font-semibold text-green-600">{agent.connectedCalls}</td>
                                                        <td className={`px-4 py-3 text-center font-bold ${rate >= 50 ? 'text-green-600' : 'text-red-500'}`}>{rate}%</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="h-8" />
            </div>
        </div>
    );
}