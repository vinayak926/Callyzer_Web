// import { useState, useEffect, useCallback } from 'react';
// import { api } from '../services/api';

// const fmtDuration = (s) => {
//     if (!s) return '0m';
//     const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
//     return h > 0 ? `${h}h ${m}m` : `${m}m`;
// };

// const medals      = ['🥇', '🥈', '🥉'];
// const avatarColors = ['#4A68F0', '#7322C0', '#16BE62', '#F0204E', '#F0991A', '#0AAECC'];

// export default function Leaderboard() {
//     const [period, setPeriod]   = useState('weekly');
//     const [leaders, setLeaders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError]     = useState('');

//     const fetchLeaderboard = useCallback(async () => {
//         setError('');
//         try {
//             const res = await api.getLeaderboard(period);
//             setLeaders(res.leaderboard || []);
//         } catch { setError('Failed to load leaderboard.'); }
//         finally { setLoading(false); setRefreshing(false); }
//     }, [period]);

//     useEffect(() => { setLoading(true); fetchLeaderboard(); }, [fetchLeaderboard]);

//     return (
//         <div className="min-h-full bg-gray-50">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
//                 <div>
//                     <h2 className="text-xl font-extrabold text-gray-900">Leaderboard</h2>
//                     <p className="text-xs text-gray-500">Top performing salespersons</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button onClick={() => { setRefreshing(true); fetchLeaderboard(); }} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200">🔄</button>
//                     <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">🏆</div>
//                 </div>
//             </div>

//             <div className="p-4 lg:p-6 max-w-3xl mx-auto">
//                 {/* Period Toggle */}
//                 <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 border border-gray-200">
//                     {[{ key: 'weekly', label: 'This Week' }, { key: 'monthly', label: 'This Month' }].map(p => (
//                         <button
//                             key={p.key}
//                             onClick={() => setPeriod(p.key)}
//                             className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${period === p.key ? 'bg-amber-400 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
//                         >
//                             {p.label}
//                         </button>
//                     ))}
//                 </div>

//                 {loading ? (
//                     <div className="flex flex-col items-center justify-center py-20 gap-3">
//                         <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
//                         <p className="text-sm text-gray-500">Loading leaderboard...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
//                         <div className="text-5xl mb-4">⚠️</div>
//                         <p className="text-red-500 font-semibold mb-4">{error}</p>
//                         <button onClick={fetchLeaderboard} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">Try Again</button>
//                     </div>
//                 ) : leaders.length === 0 ? (
//                     <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
//                         <div className="text-6xl mb-4 opacity-50">📭</div>
//                         <p className="text-lg font-bold text-gray-800">No Data Available</p>
//                         <p className="text-sm text-gray-500 mt-1">No records for this period</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-5">
//                         {/* Podium — top 3 */}
//                         {leaders.length >= 3 && (
//                             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                                 <div className="flex items-end justify-center gap-2 p-6 pb-0">
//                                     {/* 2nd */}
//                                     <div className="flex flex-col items-center flex-1">
//                                         <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl mb-2">🥈</div>
//                                         <p className="text-sm font-bold text-gray-600 text-center leading-tight">{leaders[1]?.agentName || '—'}</p>
//                                         <p className="text-xs text-gray-400 text-center truncate max-w-full px-1">{leaders[1]?.agentEmail || ''}</p>
//                                         <p className="text-xs text-gray-500 mt-1">{leaders[1]?.totalCalls} calls</p>
//                                         <div className="w-full h-10 bg-gray-100 rounded-t-lg mt-3" />
//                                     </div>
//                                     {/* 1st */}
//                                     <div className="flex flex-col items-center flex-1 -mb-px">
//                                         <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-3xl mb-2">🥇</div>
//                                         <p className="text-sm font-extrabold text-amber-500 text-center leading-tight">{leaders[0]?.agentName || '—'}</p>
//                                         <p className="text-xs text-amber-400 text-center truncate max-w-full px-1">{leaders[0]?.agentEmail || ''}</p>
//                                         <p className="text-xs text-amber-500 font-bold mt-1">{leaders[0]?.totalCalls} calls</p>
//                                         <div className="w-full h-16 bg-amber-50 rounded-t-lg mt-3" />
//                                     </div>
//                                     {/* 3rd */}
//                                     <div className="flex flex-col items-center flex-1">
//                                         <div className="w-11 h-11 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-xl mb-2">🥉</div>
//                                         <p className="text-sm font-bold text-gray-600 text-center leading-tight">{leaders[2]?.agentName || '—'}</p>
//                                         <p className="text-xs text-gray-400 text-center truncate max-w-full px-1">{leaders[2]?.agentEmail || ''}</p>
//                                         <p className="text-xs text-gray-500 mt-1">{leaders[2]?.totalCalls} calls</p>
//                                         <div className="w-full h-7 bg-orange-50 rounded-t-lg mt-3" />
//                                     </div>
//                                 </div>
//                                 <p className="text-center text-xs text-gray-400 font-medium py-3 border-t border-gray-100">🏆 Top Performers 🏆</p>
//                             </div>
//                         )}

//                         {/* All Rankings */}
//                         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                             <div className="px-5 py-4 border-b border-gray-100">
//                                 <h3 className="font-bold text-gray-900">All Rankings</h3>
//                             </div>
//                             <div className="divide-y divide-gray-50">
//                                 {leaders.map((agent, idx) => (
//                                     <div
//                                         key={agent._id || idx}
//                                         className={`flex items-center gap-3 px-4 py-4 ${idx === 0 ? 'bg-amber-50' : idx === 1 ? 'bg-gray-50/80' : idx === 2 ? 'bg-orange-50/50' : ''}`}
//                                         style={{ borderLeft: `3px solid ${idx === 0 ? '#f59e0b' : idx === 1 ? '#64748b' : idx === 2 ? '#f97316' : 'transparent'}` }}
//                                     >
//                                         {/* Rank */}
//                                         <div className="w-10 flex-shrink-0 flex items-center justify-center">
//                                             {idx < 3 ? (
//                                                 <span className="text-xl">{medals[idx]}</span>
//                                             ) : (
//                                                 <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
//                                                     <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Avatar */}
//                                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: avatarColors[idx % avatarColors.length] + '20', color: avatarColors[idx % avatarColors.length] }}>
//                                             {(agent.agentName || 'U').charAt(0).toUpperCase()}
//                                         </div>

//                                         {/* Info */}
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{agent.agentName || 'Unknown'}</p>
//                                             <p className="text-xs text-gray-400 mt-0.5 truncate">{agent.agentEmail || 'No email'}</p>
//                                         </div>

//                                         {/* Stats */}
//                                         <div className="flex items-center gap-4 flex-shrink-0">
//                                             <div className="text-center">
//                                                 <p className="text-sm font-extrabold text-indigo-600">{agent.totalCalls || 0}</p>
//                                                 <p className="text-xs text-gray-400">Calls</p>
//                                             </div>
//                                             <div className="w-px h-6 bg-gray-200" />
//                                             <div className="text-center">
//                                                 <p className="text-sm font-extrabold text-green-600">{agent.salesDone || 0}</p>
//                                                 <p className="text-xs text-gray-400">Sales</p>
//                                             </div>
//                                             <div className="w-px h-6 bg-gray-200" />
//                                             <div className="text-center">
//                                                 <p className="text-sm font-extrabold text-purple-600">{fmtDuration(agent.totalDuration)}</p>
//                                                 <p className="text-xs text-gray-400">Time</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Trophy, Medal, TrendingUp, Phone, Clock, RefreshCcw } from 'lucide-react';
import { Avatar, Badge, Button, Select, LoadingPage, EmptyState, ProgressBar, StatCard } from '../components/UI';

const PERIOD_OPTIONS = [
    { value: 'today', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all', label: 'All Time' },
];

const RANK_CONFIG = [
    { bg: '#FEF3C7', border: '#F59E0B', color: '#92400E', icon: '🥇' },
    { bg: '#F1F5F9', border: '#CBD5E1', color: '#475569', icon: '🥈' },
    { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B', icon: '🥉' },
];

const fmtDuration = (s) => {
    if (!s) return '0s';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

export default function Leaderboard() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(true);

    const fetchBoard = async (p = period) => {
        setLoading(true);
        try {
            const res = await api.getLeaderboard(p);
            setData(res?.leaderboard || res?.data || res || []);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { fetchBoard(period); }, [period]);

    const myEntry = data.find(e =>
        e._id?.toString() === user?._id?.toString() || e.agentEmail === user?.email
    );
    const myRank = myEntry ? data.indexOf(myEntry) + 1 : null;
    const topThree = data.slice(0, 3);
    const rest = data.slice(3);
    const maxCalls = data[0]?.totalCalls || 1;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Top performing agents ranked by call volume</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={period}
                        onChange={e => setPeriod(e.target.value)}
                        options={PERIOD_OPTIONS}
                        className="w-40"
                    />
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={() => fetchBoard(period)}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* My Rank Banner */}
            {myRank && (
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 text-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                            <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-xs font-medium">Your Ranking</p>
                            <p className="font-bold text-lg leading-none mt-0.5">#{myRank} of {data.length}</p>
                        </div>
                    </div>
                    {myEntry && (
                        <div className="flex items-center gap-6 text-right">
                            <div>
                                <p className="text-2xl font-bold">{myEntry.totalCalls || 0}</p>
                                <p className="text-blue-200 text-xs">Total Calls</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{myEntry.connectedCalls || 0}</p>
                                <p className="text-blue-200 text-xs">Connected</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {loading ? (
                <LoadingPage />
            ) : data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState
                        icon={Trophy}
                        title="No leaderboard data"
                        description="No performance data is available for this period."
                    />
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    {topThree.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {topThree.map((entry, i) => {
                                const cfg = RANK_CONFIG[i];
                                const rate = entry.totalCalls > 0
                                    ? Math.round((entry.connectedCalls / entry.totalCalls) * 100) : 0;
                                const isMe = entry._id?.toString() === user?._id?.toString();
                                return (
                                    <div
                                        key={entry._id || i}
                                        className={`relative bg-white rounded-2xl border-2 p-5 text-center shadow-sm transition-all ${isMe ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                                            }`}
                                        style={{ borderColor: cfg.border }}
                                    >
                                        {i === 0 && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                                TOP PERFORMER
                                            </div>
                                        )}
                                        <div className="text-2xl mb-2 mt-1">{cfg.icon}</div>
                                        <Avatar name={entry.name || entry.agentName} size="lg" className="mx-auto" />
                                        <p className="font-bold text-slate-900 mt-2 truncate">{entry.name || entry.agentName}</p>
                                        <p className="text-xs text-slate-400 truncate">{entry.email || entry.agentEmail}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <div className="bg-slate-50 rounded-xl p-2">
                                                <p className="text-lg font-bold text-blue-600">{entry.totalCalls || 0}</p>
                                                <p className="text-[11px] text-slate-400">Calls</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-2">
                                                <p className="text-lg font-bold text-emerald-600">{rate}%</p>
                                                <p className="text-[11px] text-slate-400">Rate</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Full Rankings */}
                    {rest.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Rankings</p>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {rest.map((entry, i) => {
                                    const rank = i + 4;
                                    const isMe = entry._id?.toString() === user?._id?.toString();
                                    const rate = entry.totalCalls > 0
                                        ? Math.round((entry.connectedCalls / entry.totalCalls) * 100) : 0;
                                    return (
                                        <div
                                            key={entry._id || i}
                                            className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors ${isMe ? 'bg-blue-50/40' : ''}`}
                                        >
                                            <span className="text-sm font-bold text-slate-300 w-7 shrink-0 text-center">
                                                #{rank}
                                            </span>
                                            <Avatar name={entry.name || entry.agentName} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                                        {entry.name || entry.agentName}
                                                    </p>
                                                    {isMe && <Badge variant="blue" className="text-[10px]">You</Badge>}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <ProgressBar
                                                        value={entry.totalCalls}
                                                        max={maxCalls}
                                                        color="#3B82F6"
                                                        height={4}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0 text-right">
                                                <div className="hidden sm:block">
                                                    <p className="text-sm font-bold text-emerald-600">{rate}%</p>
                                                    <p className="text-[11px] text-slate-400">Rate</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-blue-600">{entry.totalCalls || 0}</p>
                                                    <p className="text-[11px] text-slate-400">Calls</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}