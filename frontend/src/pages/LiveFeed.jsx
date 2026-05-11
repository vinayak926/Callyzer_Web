// import React, { useEffect, useState, useRef, useContext } from 'react';
// import io from 'socket.io-client';
// import { AuthContext } from '../context/AuthContext';
// import { api } from '../services/api';
// import { API_BASE_URL } from '../config';

// const fmtDuration = (sec) => {
//     if (!sec || sec === 0) return '0s';
//     const m = Math.floor(sec / 60), s = sec % 60;
//     return m > 0 ? `${m}m ${s}s` : `${s}s`;
// };

// const timeAgo = (date) => {
//     const diff = Math.floor((Date.now() - new Date(date)) / 1000);
//     if (diff < 60) return `${diff}s ago`;
//     if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//     return `${Math.floor(diff / 3600)}h ago`;
// };

// const statusColor = (status) => {
//     if (status === 'Connected') return '#17C964';
//     if (status === 'Missed') return '#F31260';
//     if (status === 'Rejected') return '#F5A524';
//     return '#6B7A99';
// };

// const statusBg = (status) => {
//     if (status === 'Connected') return '#E8FBF0';
//     if (status === 'Missed') return '#FEE7EF';
//     if (status === 'Rejected') return '#FFF4E0';
//     return '#F0F2F7';
// };

// const callTypeLabel = (type) => type === 'Incoming' ? '↙ In' : '↗ Out';
// const callTypeBg = (type) => type === 'Incoming' ? '#E6F1FE' : '#F0E6FF';
// const callTypeColor = (type) => type === 'Incoming' ? '#006FEE' : '#7828C8';

// export default function LiveFeed() {
//     const { user } = useContext(AuthContext);
//     const [calls, setCalls] = useState([]);
//     const [isLive, setIsLive] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [newCallCount, setNewCallCount] = useState(0);
//     const socketRef = useRef(null);
//     const [pulseAnim] = useState({ transform: 'scale(1)' });

//     useEffect(() => {
//         const interval = setInterval(() => {
//             // Pulse animation effect
//         }, 600);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => { loadRecentCalls(); }, []);

//     useEffect(() => {
//         if (!user?._id) return;

//         const API_URL = API_BASE_URL.replace('/api', '');
//         const socket = io(API_URL, { transports: ['websocket'], reconnectionAttempts: 5 });
//         socketRef.current = socket;

//         socket.on('connect', () => {
//             setIsLive(true);
//             socket.emit('join-user', { userId: user._id, role: user.role });
//         });

//         socket.on('disconnect', () => setIsLive(false));

//         socket.on('new-call', (callData) => {
//             setCalls(prev => prev.find(c => c._id === callData._id) ? prev : [{ ...callData, isNew: true }, ...prev].slice(0, 100));
//             setNewCallCount(prev => prev + 1);
//         });

//         return () => socket.disconnect();
//     }, [user?._id]);

//     const loadRecentCalls = async () => {
//         try {
//             setRefreshing(true);
//             const today = new Date().toISOString().split('T')[0];
//             const data = await api.getCallLogs({ dateFrom: today, limit: 50 });
//             if (data?.logs) setCalls(data.logs.map(c => ({ ...c, isNew: false })));
//         } catch (err) { console.error(err); }
//         finally { setRefreshing(false); }
//     };

//     const connected = calls.filter(c => c.callStatus === 'Connected').length;
//     const missed = calls.filter(c => c.callStatus === 'Missed').length;
//     const total = calls.length;
//     const connectRate = total > 0 ? Math.round((connected / total) * 100) : 0;

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* Stats Bar */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-around">
//                 <div className="text-center">
//                     <p className="text-xl font-extrabold text-indigo-600">{total}</p>
//                     <p className="text-xs text-gray-500 font-medium">Total</p>
//                 </div>
//                 <div className="w-px h-8 bg-gray-200" />
//                 <div className="text-center">
//                     <p className="text-xl font-extrabold text-green-600">{connected}</p>
//                     <p className="text-xs text-gray-500 font-medium">Connected</p>
//                 </div>
//                 <div className="w-px h-8 bg-gray-200" />
//                 <div className="text-center">
//                     <p className="text-xl font-extrabold text-red-500">{missed}</p>
//                     <p className="text-xs text-gray-500 font-medium">Missed</p>
//                 </div>
//                 <div className="w-px h-8 bg-gray-200" />
//                 <div className="text-center">
//                     <p className="text-xl font-extrabold text-indigo-600">{connectRate}%</p>
//                     <p className="text-xs text-gray-500 font-medium">Rate</p>
//                 </div>
//             </div>

//             {/* Live Indicator Header */}
//             <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <h2 className="text-white font-bold text-lg">Live Feed</h2>
//                     <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
//                         <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
//                         <span className="text-white text-xs font-bold">{isLive ? 'LIVE' : 'Offline'}</span>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     {newCallCount > 0 && (
//                         <div className="bg-white/20 rounded-full px-3 py-1">
//                             <span className="text-white text-xs font-bold">{newCallCount} new</span>
//                         </div>
//                     )}
//                     <button onClick={() => { loadRecentCalls(); setNewCallCount(0); }} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">🔄</button>
//                 </div>
//             </div>

//             {/* Call List */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                 {calls.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-96 text-center">
//                         <div className="text-5xl mb-4">📞</div>
//                         <p className="text-gray-500 text-sm">No call activity yet</p>
//                         <p className="text-gray-400 text-xs mt-1">When team members make calls, they'll appear here</p>
//                     </div>
//                 ) : (
//                     calls.map((call, idx) => (
//                         <div key={call._id || idx} className={`bg-white rounded-xl border ${call.isNew ? 'border-indigo-400 shadow-md' : 'border-gray-100'} p-4`}>
//                             <div className="flex items-start justify-between mb-2">
//                                 <div>
//                                     <p className="font-bold text-gray-900">{call.customerName || 'Unknown'}</p>
//                                     <p className="text-sm text-gray-500">{call.customerNumber}</p>
//                                 </div>
//                                 {call.isNew && <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>}
//                             </div>
//                             <div className="flex flex-wrap gap-2 mb-3">
//                                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold`} style={{ backgroundColor: callTypeBg(call.callType), color: callTypeColor(call.callType) }}>{callTypeLabel(call.callType)}</span>
//                                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold`} style={{ backgroundColor: statusBg(call.callStatus), color: statusColor(call.callStatus) }}>
//                                     <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: statusColor(call.callStatus) }} />
//                                     {call.callStatus}
//                                 </span>
//                             </div>
//                             <div className="flex items-center justify-between text-xs text-gray-400">
//                                 <span>👤 {call.agent?.name || 'Unknown'}</span>
//                                 <div className="flex items-center gap-3">
//                                     <span>⏱ {fmtDuration(call.durationSeconds)}</span>
//                                     <span>{timeAgo(call.calledAt)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
    Radio, Phone, PhoneOff, ArrowDownLeft, ArrowUpRight,
    RefreshCcw, Clock, Activity,
} from 'lucide-react';
import { Badge, Avatar, Card, StatCard, LoadingPage, EmptyState } from '../components/UI';

const fmtTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—';

const fmtDuration = (s) => {
    if (!s) return '0s';
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const STATUS_CONFIG = {
    Connected: { variant: 'green', color: '#10B981', bg: '#ECFDF5' },
    Missed: { variant: 'red', color: '#F43F5E', bg: '#FFF1F2' },
    Rejected: { variant: 'yellow', color: '#F59E0B', bg: '#FFFBEB' },
    default: { variant: 'default', color: '#94A3B8', bg: '#F8FAFC' },
};

export default function LiveFeed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [newEntries, setNewEntries] = useState(new Set());
    const intervalRef = useRef(null);

    const fetchFeed = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await api.getLiveFeed();
            const entries = data?.logs || data?.data || data || [];

            // Detect new entries
            if (feed.length > 0) {
                const existingIds = new Set(feed.map(e => e._id));
                const fresh = entries.filter(e => !existingIds.has(e._id)).map(e => e._id);
                if (fresh.length > 0) {
                    setNewEntries(new Set(fresh));
                    setTimeout(() => setNewEntries(new Set()), 3000);
                }
            }

            setFeed(entries);
            setLastUpdated(new Date());
        } catch (e) { console.log(e); }
        if (!silent) setLoading(false);
    };

    useEffect(() => {
        fetchFeed();
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => fetchFeed(true), 15000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [autoRefresh, feed]);

    const totalToday = feed.length;
    const connected = feed.filter(e => e.callStatus === 'Connected').length;
    const missed = feed.filter(e => e.callStatus === 'Missed').length;
    const activeAgents = new Set(feed.map(e => e.agent?._id || e.agentId)).size;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-slate-900">Live Feed</h2>
                        {autoRefresh && (
                            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                                <span className="text-xs font-semibold text-emerald-600">Live</span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {lastUpdated
                            ? `Last updated ${fmtTime(lastUpdated.toISOString())}`
                            : 'Real-time call activity'
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoRefresh(v => !v)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${autoRefresh
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <Radio size={13} />
                        {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                    </button>
                    <button
                        onClick={() => fetchFeed()}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <RefreshCcw size={13} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Today's Calls" value={totalToday} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                <StatCard label="Connected" value={connected} icon={Activity} color="#10B981" bgColor="#ECFDF5" />
                <StatCard label="Missed" value={missed} icon={PhoneOff} color="#F43F5E" bgColor="#FFF1F2" />
                <StatCard label="Active Agents" value={activeAgents} icon={Radio} color="#8B5CF6" bgColor="#F5F3FF" />
            </div>

            {/* Feed */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Recent Activity · {feed.length} records
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Connected
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Missed
                        </div>
                    </div>
                </div>

                {loading ? (
                    <LoadingPage />
                ) : feed.length === 0 ? (
                    <EmptyState
                        icon={Radio}
                        title="No live activity"
                        description="Call activity will appear here as your team makes and receives calls."
                    />
                ) : (
                    <div className="divide-y divide-slate-50 max-h-[calc(100vh-22rem)] overflow-y-auto">
                        {feed.map((entry, i) => {
                            const sc = STATUS_CONFIG[entry.callStatus] || STATUS_CONFIG.default;
                            const isIn = entry.callType === 'Incoming';
                            const isNew = newEntries.has(entry._id);
                            return (
                                <div
                                    key={entry._id || i}
                                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-all ${isNew ? 'bg-blue-50/60 animate-fade-in' : ''
                                        }`}
                                >
                                    {/* Direction icon */}
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: sc.bg }}
                                    >
                                        {isIn
                                            ? <ArrowDownLeft size={16} style={{ color: sc.color }} />
                                            : <ArrowUpRight size={16} style={{ color: sc.color }} />
                                        }
                                    </div>

                                    {/* Contact info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                {entry.customerName || 'Unknown Contact'}
                                            </p>
                                            <span className="text-xs text-slate-400 font-mono">
                                                {entry.customerNumber || entry.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <Badge variant={sc.variant} dot>{entry.callStatus}</Badge>
                                            <Badge variant={isIn ? 'cyan' : 'blue'}>{entry.callType}</Badge>
                                            {entry.durationSeconds > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Clock size={11} />
                                                    {fmtDuration(entry.durationSeconds)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Agent */}
                                    {entry.agent && (
                                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                                            <Avatar name={entry.agent.name} size="xs" />
                                            <span className="text-xs font-medium text-slate-500 max-w-[100px] truncate">
                                                {entry.agent.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Time */}
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-medium text-slate-500">
                                            {fmtTime(entry.calledAt || entry.startTime)}
                                        </p>
                                        {isNew && (
                                            <span className="text-[10px] font-bold text-blue-500 mt-0.5 block">NEW</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}