// import { useState, useEffect, useCallback } from 'react';
// import { api } from '../services/api';

// const fmtDuration = (s) => {
//     if (!s) return '0m';
//     const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
//     return h > 0 ? `${h}h ${m}m` : `${m}m`;
// };
// const getDateRange = (period) => {
//     const now = new Date();
//     const to  = now.toISOString().split('T')[0];
//     let from;
//     if      (period === 'today')   { from = to; }
//     else if (period === 'week')    { const d = new Date(now); d.setDate(d.getDate() - 6);   from = d.toISOString().split('T')[0]; }
//     else if (period === 'month')   { const d = new Date(now); d.setDate(1);                  from = d.toISOString().split('T')[0]; }
//     else                           { const d = new Date(now); d.setMonth(d.getMonth() - 3); from = d.toISOString().split('T')[0]; }
//     return { dateFrom: from, dateTo: to };
// };
// const buildDailyBuckets = (logs, period) => {
//     const buckets = {};
//     const now  = new Date();
//     const days = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 90;
//     for (let i = days - 1; i >= 0; i--) {
//         const d = new Date(now); d.setDate(d.getDate() - i);
//         const key = d.toISOString().split('T')[0];
//         buckets[key] = { date: key, total: 0, connected: 0, missed: 0, rejected: 0 };
//     }
//     logs.forEach(log => {
//         const key = log.calledAt ? log.calledAt.split('T')[0] : null;
//         if (key && buckets[key]) {
//             buckets[key].total++;
//             if (log.callStatus === 'Connected') buckets[key].connected++;
//             else if (log.callStatus === 'Missed') buckets[key].missed++;
//             else if (log.callStatus === 'Rejected') buckets[key].rejected++;
//         }
//     });
//     return Object.values(buckets);
// };

// const PERIODS = [
//     { key: 'today',   label: 'Today',      icon: '📅' },
//     { key: 'week',    label: 'This Week',  icon: '📆' },
//     { key: 'month',   label: 'This Month', icon: '📊' },
//     { key: 'quarter', label: 'Last 3M',    icon: '📈' },
// ];

// // Mini horizontal bar
// function MiniBar({ value, max, color }) {
//     const pct = Math.round((value / Math.max(max, 1)) * 100);
//     return (
//         <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-2">
//             <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
//         </div>
//     );
// }

// export default function Reports() {
//     const [period, setPeriod]       = useState('month');
//     const [logs, setLogs]           = useState([]);
//     const [loading, setLoading]     = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError]         = useState('');
//     const [exporting, setExporting] = useState(false);
//     const [hourlyData, setHourlyData] = useState([]);
//     const [peakHour, setPeakHour]   = useState(null);
//     const [agentReports, setAgentReports] = useState([]);

//     const fetchData = useCallback(async () => {
//         setError('');
//         try {
//             const { dateFrom, dateTo } = getDateRange(period);
//             const [logsRes, hourlyRes, teamRes] = await Promise.allSettled([
//                 api.getCallLogs({ dateFrom, dateTo, limit: 500, sortField: 'calledAt', sortDir: 'asc' }),
//                 api.getHourlyReport(new Date().toISOString().split('T')[0]),
//                 api.getTeamCallStats(),
//             ]);
//             if (logsRes.status === 'fulfilled') {
//                 const r = logsRes.value;
//                 setLogs(r?.logs || (Array.isArray(r) ? r : []));
//             }
//             if (hourlyRes.status === 'fulfilled') {
//                 const h = hourlyRes.value;
//                 setHourlyData(h?.workHours || []);
//                 setPeakHour(h?.peakHour || null);
//             }
//             if (teamRes.status === 'fulfilled') {
//                 setAgentReports(teamRes.value?.agents || []);
//             }
//         } catch { setError('Cannot connect to server.'); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, [period]);

//     useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);

//     // ── Computed ──────────────────────────────────────────
//     const total     = logs.length;
//     const connected = logs.filter(l => l.callStatus === 'Connected').length;
//     const missed    = logs.filter(l => l.callStatus === 'Missed').length;
//     const rejected  = logs.filter(l => l.callStatus === 'Rejected').length;
//     const outgoing  = logs.filter(l => l.callType === 'Outgoing').length;
//     const incoming  = logs.filter(l => l.callType === 'Incoming').length;
//     const connRate  = total ? Math.round((connected / total) * 100) : 0;
//     const totalDur  = logs.reduce((s, l) => s + (l.durationSeconds || 0), 0);
//     const avgDur    = total ? Math.round(totalDur / total) : 0;

//     const dispositions = {};
//     logs.forEach(l => { if (l.disposition) dispositions[l.disposition] = (dispositions[l.disposition] || 0) + 1; });
//     const dispEntries = Object.entries(dispositions).sort((a, b) => b[1] - a[1]);

//     const allBuckets   = buildDailyBuckets(logs, period);
//     const step         = period === 'quarter' ? 7 : period === 'month' ? 3 : 1;
//     const chartBuckets = allBuckets.filter((_, i, arr) => i % step === 0 || i === arr.length - 1);
//     const maxBucket    = Math.max(...allBuckets.map(b => b.total), 1);

//     const summaryCards = [
//         { title: 'Total Calls',    value: String(total),              color: '#6366f1', icon: '📞' },
//         { title: 'Connected',      value: String(connected),          color: '#22c55e', icon: '✅' },
//         { title: 'Missed',         value: String(missed),             color: '#ef4444', icon: '❌' },
//         { title: 'Connect Rate',   value: `${connRate}%`,             color: '#3b82f6', icon: '📈' },
//         { title: 'Avg Duration',   value: fmtDuration(avgDur),        color: '#8b5cf6', icon: '⏱' },
//         { title: 'Total Duration', value: fmtDuration(totalDur),      color: '#f59e0b', icon: '🕐' },
//     ];

//     const periodLabel     = PERIODS.find(p => p.key === period)?.label || '';
//     const { dateFrom, dateTo } = getDateRange(period);

//     // ── Export CSV ────────────────────────────────────────
//     const handleExportCSV = () => {
//         if (total === 0) return;
//         const headers = ['Customer Name', 'Phone', 'Type', 'Status', 'Duration', 'Disposition', 'Date'];
//         const rows = logs.map(l => [
//             l.customerName || '—', l.customerNumber || '—', l.callType || '—',
//             l.callStatus || '—', fmtDuration(l.durationSeconds),
//             l.disposition || '—',
//             l.calledAt ? new Date(l.calledAt).toLocaleDateString('en-IN') : '—',
//         ]);
//         const csv  = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
//         const blob = new Blob([csv], { type: 'text/csv' });
//         const url  = URL.createObjectURL(blob);
//         const a    = document.createElement('a');
//         a.href = url; a.download = `report-${period}.csv`; a.click();
//         URL.revokeObjectURL(url);
//     };

//     if (loading) return (
//         <div className="flex flex-col items-center justify-center h-full gap-3 bg-gray-50">
//             <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//             <p className="text-sm text-gray-500 font-medium">Loading reports...</p>
//         </div>
//     );

//     return (
//         <div className="min-h-full bg-gray-100">
//             {/* Header */}
//             <div className="bg-slate-900 px-4 lg:px-6 py-6 rounded-b-3xl">
//                 <div className="flex items-center justify-between max-w-5xl mx-auto">
//                     <div>
//                         <h2 className="text-xl font-extrabold text-white">Reports & Analytics</h2>
//                         <p className="text-sm text-slate-400 mt-0.5">Track your call performance metrics</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">📊</div>
//                 </div>
//             </div>

//             <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">
//                 {/* Period Selector */}
//                 <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Period</p>
//                     <div className="flex flex-wrap gap-2">
//                         {PERIODS.map(p => (
//                             <button key={p.key} onClick={() => setPeriod(p.key)}
//                                 className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${period === p.key ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
//                                 <span>{p.icon}</span> {p.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Export Buttons */}
//                 <div className="flex gap-3">
//                     <button onClick={handleExportCSV} disabled={total === 0} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-2xl shadow-sm text-sm">
//                         ⬇️ Download CSV
//                     </button>
//                     <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-sm text-sm">
//                         🖨️ Print Report
//                     </button>
//                 </div>

//                 {/* Error */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 flex items-center justify-between">
//                         <p className="text-red-600 text-sm">⚠️ {error}</p>
//                         <button onClick={fetchData} className="text-red-600 font-bold text-sm ml-4">Retry →</button>
//                     </div>
//                 )}

//                 {/* Empty */}
//                 {!error && total === 0 && (
//                     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
//                         <div className="text-5xl mb-4">📊</div>
//                         <p className="text-lg font-bold text-gray-800">No Calls Found</p>
//                         <p className="text-sm text-gray-500 mt-1">No call logs for "{periodLabel}"</p>
//                         <p className="text-xs text-gray-400 mt-1">Select a different period or add some calls first</p>
//                     </div>
//                 )}

//                 {total > 0 && (
//                     <>
//                         {/* Summary Cards */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-3">
//                                 <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                 <h3 className="font-bold text-gray-900 text-sm">Key Metrics — {periodLabel}</h3>
//                             </div>
//                             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
//                                 {summaryCards.map((card, i) => (
//                                     <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm" style={{ borderTop: `3px solid ${card.color}` }}>
//                                         <div className="text-xl mb-2">{card.icon}</div>
//                                         <p className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</p>
//                                         <p className="text-xs text-gray-500 font-medium mt-1">{card.title}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Call Type Split */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-3">
//                                 <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                 <h3 className="font-bold text-gray-900 text-sm">Call Type Split</h3>
//                             </div>
//                             <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
//                                 {[{ label: 'Outgoing', value: outgoing, color: '#6366f1' }, { label: 'Incoming', value: incoming, color: '#3b82f6' }].map(item => (
//                                     <div key={item.label} className="flex items-center gap-2">
//                                         <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
//                                         <span className="text-sm font-semibold text-gray-700 w-20">{item.label}</span>
//                                         <MiniBar value={item.value} max={total} color={item.color} />
//                                         <span className="text-sm font-bold text-gray-700 w-8 text-right">{item.value}</span>
//                                         <span className="text-xs text-gray-400 w-10 text-right">{total ? Math.round((item.value / total) * 100) : 0}%</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Status Distribution */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-3">
//                                 <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                 <h3 className="font-bold text-gray-900 text-sm">Call Status Distribution</h3>
//                             </div>
//                             <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
//                                 {[
//                                     { label: 'Connected', value: connected, color: '#22c55e' },
//                                     { label: 'Missed',    value: missed,    color: '#ef4444' },
//                                     { label: 'Rejected',  value: rejected,  color: '#f59e0b' },
//                                 ].map(item => (
//                                     <div key={item.label} className="flex items-center gap-2">
//                                         <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
//                                         <span className="text-sm font-semibold text-gray-700 w-20">{item.label}</span>
//                                         <MiniBar value={item.value} max={total} color={item.color} />
//                                         <span className="text-sm font-bold text-gray-700 w-8 text-right">{item.value}</span>
//                                         <span className="text-xs text-gray-400 w-10 text-right">{total ? Math.round((item.value / total) * 100) : 0}%</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Daily Trend */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-3">
//                                 <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                 <h3 className="font-bold text-gray-900 text-sm">Daily Trend</h3>
//                             </div>
//                             <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm overflow-x-auto">
//                                 <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
//                                     {[['Connected', '#22c55e'], ['Missed', '#ef4444'], ['Rejected', '#f59e0b']].map(([l, c]) => (
//                                         <div key={l} className="flex items-center gap-1.5">
//                                             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
//                                             <span className="text-xs text-gray-500 font-medium">{l}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="flex items-end gap-2 min-w-0 overflow-x-auto pb-2" style={{ minHeight: '120px' }}>
//                                     {chartBuckets.map((b, i) => {
//                                         const BAR_H   = 80;
//                                         const connH   = Math.round((b.connected / maxBucket) * BAR_H);
//                                         const missH   = Math.round((b.missed    / maxBucket) * BAR_H);
//                                         const rejH    = Math.round((b.rejected  / maxBucket) * BAR_H);
//                                         const label   = period === 'today' ? 'Today' :
//                                             period === 'week' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(b.date).getDay()] :
//                                             b.date.slice(5);
//                                         return (
//                                             <div key={i} className="flex flex-col items-center min-w-[32px]">
//                                                 <span className="text-xs text-gray-400 mb-1 font-medium" style={{ minHeight: '16px' }}>{b.total || ''}</span>
//                                                 <div className="flex items-end gap-0.5" style={{ height: BAR_H }}>
//                                                     {connH > 0 && <div className="w-2 rounded-t" style={{ height: connH, backgroundColor: '#22c55e' }} />}
//                                                     {missH > 0 && <div className="w-2 rounded-t" style={{ height: missH, backgroundColor: '#ef4444' }} />}
//                                                     {rejH  > 0 && <div className="w-2 rounded-t" style={{ height: rejH,  backgroundColor: '#f59e0b' }} />}
//                                                     {b.total === 0 && <div className="w-2 rounded-t bg-gray-200" style={{ height: 4 }} />}
//                                                 </div>
//                                                 <span className="text-xs text-gray-400 mt-1">{label}</span>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Disposition Breakdown */}
//                         {dispEntries.length > 0 && (
//                             <div>
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                     <h3 className="font-bold text-gray-900 text-sm">Disposition Breakdown</h3>
//                                 </div>
//                                 <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
//                                     {dispEntries.map(([label, count], i) => {
//                                         const cols  = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4'];
//                                         const color = cols[i % cols.length];
//                                         return (
//                                             <div key={label} className="flex items-center gap-2">
//                                                 <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
//                                                 <span className="text-sm font-semibold text-gray-700 w-28 truncate">{label}</span>
//                                                 <MiniBar value={count} max={total} color={color} />
//                                                 <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
//                                                 <span className="text-xs text-gray-400 w-10 text-right">{Math.round((count / total) * 100)}%</span>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Today's Hourly Breakdown */}
//                         {hourlyData.length > 0 && (
//                             <div>
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                     <h3 className="font-bold text-gray-900 text-sm">Today's Hourly Breakdown</h3>
//                                 </div>
//                                 {peakHour && peakHour.total > 0 && (
//                                     <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 mb-3">
//                                         <span className="text-3xl">🔥</span>
//                                         <div>
//                                             <p className="font-extrabold text-amber-800">Peak Hour: {peakHour.label}</p>
//                                             <p className="text-sm text-amber-700">{peakHour.total} calls · {peakHour.connected} connected</p>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                                     <table className="w-full text-sm">
//                                         <thead className="bg-slate-900 text-white">
//                                             <tr>
//                                                 <th className="px-4 py-3 text-left text-xs font-bold">Hour</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">Total</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">✅</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">❌</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">Rate</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-50">
//                                             {hourlyData.filter(h => h.total > 0).map((h, i) => {
//                                                 const rate   = h.total > 0 ? Math.round((h.connected / h.total) * 100) : 0;
//                                                 const isPeak = peakHour && peakHour.hour === h.hour;
//                                                 return (
//                                                     <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${isPeak ? '!bg-amber-50' : ''}`}>
//                                                         <td className="px-4 py-2.5 font-semibold text-gray-800 text-sm">
//                                                             {isPeak && <span className="mr-1.5">🔥</span>}{h.label}
//                                                         </td>
//                                                         <td className="px-4 py-2.5 text-center font-bold text-gray-800">{h.total}</td>
//                                                         <td className="px-4 py-2.5 text-center font-semibold text-green-600">{h.connected}</td>
//                                                         <td className="px-4 py-2.5 text-center font-semibold text-red-500">{h.missed}</td>
//                                                         <td className={`px-4 py-2.5 text-center font-bold ${rate >= 50 ? 'text-green-600' : 'text-red-500'}`}>{rate}%</td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Team Performance */}
//                         {agentReports.length > 0 && (
//                             <div>
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <div className="w-1 h-5 bg-indigo-600 rounded-full" />
//                                     <h3 className="font-bold text-gray-900 text-sm">Today's Team Performance</h3>
//                                 </div>
//                                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                                     <table className="w-full text-sm">
//                                         <thead className="bg-slate-900 text-white">
//                                             <tr>
//                                                 <th className="px-4 py-3 text-left text-xs font-bold">Salesperson</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">Calls</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">✅</th>
//                                                 <th className="px-4 py-3 text-center text-xs font-bold">Rate</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-50">
//                                             {agentReports.map((agent, i) => {
//                                                 const rate = agent.totalCalls > 0 ? Math.round((agent.connectedCalls / agent.totalCalls) * 100) : 0;
//                                                 return (
//                                                     <tr key={agent._id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
//                                                         <td className="px-4 py-3">
//                                                             <div className="flex items-center gap-2">
//                                                                 <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
//                                                                     <span className="text-xs font-bold text-indigo-600">{(agent.name || 'S').charAt(0).toUpperCase()}</span>
//                                                                 </div>
//                                                                 <span className="font-semibold text-gray-800">{agent.name}</span>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-4 py-3 text-center font-bold text-gray-800">{agent.totalCalls}</td>
//                                                         <td className="px-4 py-3 text-center font-semibold text-green-600">{agent.connectedCalls}</td>
//                                                         <td className={`px-4 py-3 text-center font-bold ${rate >= 50 ? 'text-green-600' : 'text-red-500'}`}>{rate}%</td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 <div className="h-8" />
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
    BarChart2, TrendingUp, Clock, Phone, PhoneOff, Calendar,
    Download, RefreshCcw, Filter,
} from 'lucide-react';
import {
    Card, StatCard, Select, Button, LoadingPage, ProgressBar, SectionHeader, Badge,
} from '../components/UI';

const fmtDuration = (s) => {
    if (!s) return '0s';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    : '';

const PERIOD_OPTIONS = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' },
];

export default function Reports() {
    const { user } = useContext(AuthContext);
    const [period, setPeriod] = useState('week');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [agentStats, setAgentStats] = useState([]);

    const isAdmin = user?.role === 'super_admin';
    const isBusiness = user?.role === 'business_user';

    const getPeriodDates = (p) => {
        const today = new Date();
        const fmt = (d) => d.toISOString().split('T')[0];
        if (p === 'today') return { from: fmt(today), to: fmt(today) };
        if (p === 'week') {
            const mon = new Date(today);
            mon.setDate(today.getDate() - today.getDay() + 1);
            return { from: fmt(mon), to: fmt(today) };
        }
        if (p === 'month') {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            return { from: fmt(start), to: fmt(today) };
        }
        return null;
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            let from = dateFrom, to = dateTo;
            if (period !== 'custom') {
                const d = getPeriodDates(period);
                if (d) { from = d.from; to = d.to; }
            }
            const params = { dateFrom: from, dateTo: to };
            const [statsRes, dailyRes] = await Promise.allSettled([
                api.getCallStats(params),
                api.getDailyStats(params),
            ]);
            if (statsRes.status === 'fulfilled') setStats(statsRes.value);
            if (dailyRes.status === 'fulfilled') setDailyData(dailyRes.value?.daily || dailyRes.value?.data || []);

            if (isAdmin || isBusiness) {
                const agentRes = await api.getAgentStats?.(params).catch(() => null);
                if (agentRes) setAgentStats(agentRes?.agents || agentRes?.data || []);
            }
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { if (period !== 'custom') fetchReports(); }, [period]);
    useEffect(() => { if (period === 'custom' && dateFrom && dateTo) fetchReports(); }, [dateFrom, dateTo]);

    const totalCalls = stats?.totalCalls || 0;
    const connected = stats?.connected || stats?.connectedCalls || 0;
    const missed = stats?.missed || stats?.missedCalls || 0;
    const avgDuration = stats?.avgDuration || 0;
    const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

    // Calculate bar chart max for normalization
    const maxDailyCalls = Math.max(...dailyData.map(d => d.totalCalls || 0), 1);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Performance insights for your team</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" icon={Download} onClick={() => api.exportReport?.({ period })}>
                        Export
                    </Button>
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchReports}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Period Selector */}
            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date Range</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {PERIOD_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setPeriod(opt.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${period === opt.value
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                {period === 'custom' && (
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From</label>
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field" />
                        </div>
                    </div>
                )}
            </Card>

            {loading ? (
                <LoadingPage />
            ) : (
                <>
                    {/* KPI Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Calls" value={totalCalls} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                        <StatCard label="Connected" value={connected} icon={TrendingUp} color="#10B981" bgColor="#ECFDF5" />
                        <StatCard label="Missed" value={missed} icon={PhoneOff} color="#F43F5E" bgColor="#FFF1F2" />
                        <StatCard label="Avg Duration" value={fmtDuration(avgDuration)} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" />
                    </div>

                    {/* Connection Rate Card */}
                    <div className="grid lg:grid-cols-3 gap-4">
                        <Card className="lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp size={18} className="text-emerald-600" />
                                </div>
                                <p className="font-bold text-slate-800">Connection Rate</p>
                            </div>
                            {/* Donut-style visual */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-32 h-32">
                                    <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="3.8" />
                                        <circle
                                            cx="18" cy="18" r="15.9" fill="none"
                                            stroke={connectRate >= 50 ? '#10B981' : '#F43F5E'}
                                            strokeWidth="3.8"
                                            strokeDasharray={`${connectRate} ${100 - connectRate}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-2xl font-bold text-slate-900">{connectRate}%</p>
                                        <p className="text-[10px] text-slate-400">Connected</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-slate-600">Connected</span></div>
                                    <span className="font-semibold">{connected}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /><span className="text-slate-600">Missed</span></div>
                                    <span className="font-semibold">{missed}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /><span className="text-slate-600">Other</span></div>
                                    <span className="font-semibold">{totalCalls - connected - missed}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Daily Trend Bar Chart */}
                        <Card className="lg:col-span-2" padding={false}>
                            <div className="p-5 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <BarChart2 size={16} className="text-blue-500" />
                                    <p className="font-bold text-slate-800 text-sm">Daily Call Volume</p>
                                </div>
                            </div>
                            {dailyData.length === 0 ? (
                                <div className="flex items-center justify-center h-40 text-sm text-slate-400">No daily data available</div>
                            ) : (
                                <div className="p-5">
                                    <div className="flex items-end gap-1.5 h-40">
                                        {dailyData.slice(-14).map((day, i) => {
                                            const height = Math.max(4, Math.round((day.totalCalls / maxDailyCalls) * 100));
                                            const connH = day.totalCalls > 0
                                                ? Math.round(((day.connectedCalls || 0) / day.totalCalls) * height) : 0;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                    <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                                                        <div className="w-full rounded-sm overflow-hidden" style={{ height: `${height}%` }}>
                                                            <div className="w-full h-full flex flex-col justify-end">
                                                                <div className="w-full rounded-sm bg-blue-200 relative" style={{ height: `${height}%` }}>
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-sm transition-all" style={{ height: `${connH}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {fmtDate(day.date)}: {day.totalCalls} calls
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 truncate w-full text-center">
                                                        {fmtDate(day.date)?.split(' ')[0]}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <div className="w-3 h-3 rounded-sm bg-blue-500" /> Connected
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <div className="w-3 h-3 rounded-sm bg-blue-200" /> Others
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Agent Breakdown (Admin/Business only) */}
                    {(isAdmin || isBusiness) && agentStats.length > 0 && (
                        <Card padding={false}>
                            <div className="p-5 border-b border-slate-50">
                                <SectionHeader title="Agent Breakdown" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Agent</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Connected</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Rate</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Avg Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {agentStats.map((ag, i) => {
                                            const rate = ag.totalCalls > 0
                                                ? Math.round(((ag.connectedCalls || 0) / ag.totalCalls) * 100) : 0;
                                            return (
                                                <tr key={ag._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-xs text-slate-300 font-bold w-5">#{i + 1}</span>
                                                            <p className="text-sm font-semibold text-slate-800">{ag.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm font-bold text-blue-600">{ag.totalCalls}</td>
                                                    <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">{ag.connectedCalls || 0}</td>
                                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                                        <div className="flex items-center gap-2">
                                                            <ProgressBar value={rate} max={100} color={rate >= 50 ? '#10B981' : '#F43F5E'} height={4} />
                                                            <span className="text-xs font-semibold text-slate-500 w-10 shrink-0">{rate}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                                                        {fmtDuration(ag.avgDuration)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
