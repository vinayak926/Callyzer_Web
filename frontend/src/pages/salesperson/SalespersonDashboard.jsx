// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { api } from '../../services/api';

// const StatCard = ({ label, value, icon, color, soft }) => (
//     <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center" style={{ borderTopColor: color, borderTopWidth: 3 }}>
//         <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-2" style={{ backgroundColor: soft }}>{icon}</div>
//         <p className="text-2xl font-extrabold text-gray-900">{value ?? '0'}</p>
//         <p className="text-xs text-gray-500 mt-0.5">{label}</p>
//     </div>
// );

// const formatDuration = (seconds) => {
//     if (!seconds || seconds === 0) return '0s';
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     if (m === 0) return `${s}s`;
//     if (s === 0) return `${m}m`;
//     return `${m}m ${s}s`;
// };

// const CallRow = ({ call }) => {
//     const isConnected = call.callStatus === 'Connected';
//     const isMissed = call.callStatus === 'Missed' || call.callStatus === 'Rejected';
//     const color = isConnected ? '#17C964' : isMissed ? '#F31260' : '#6B7A99';
//     const bg = isConnected ? '#E8FBF0' : isMissed ? '#FEE7EF' : '#F0F2F7';
//     const icon = isConnected ? '✅' : isMissed ? '❌' : '📞';

//     const timeStr = call.calledAt ? new Date(call.calledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

//     return (
//         <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ backgroundColor: bg }}>{icon}</div>
//             <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-800 text-sm truncate">{call.customerName || call.customerNumber || 'Unknown'}</p>
//                 <p className="text-xs text-gray-400">{call.callType} · {timeStr}</p>
//             </div>
//             <div className="text-right">
//                 {isConnected && <p className="text-xs font-semibold text-gray-500">{formatDuration(call.durationSeconds)}</p>}
//                 <p className="text-xs font-bold" style={{ color }}>{call.callStatus}</p>
//             </div>
//         </div>
//     );
// };

// export default function SalespersonDashboard() {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [stats, setStats] = useState(null);
//     const [myRank, setMyRank] = useState(null);
//     const [teamSize, setTeamSize] = useState(0);
//     const [recentCalls, setRecentCalls] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const todayDate = () => new Date().toISOString().split('T')[0];

//     const fetchDashboard = async () => {
//         try {
//             const [statsRes, callsRes, leaderRes] = await Promise.allSettled([
//                 api.getCallStats({ dateFrom: todayDate(), dateTo: todayDate() }),
//                 api.getCallLogs({ page: 1, limit: 5, sortField: 'calledAt', sortDir: 'desc' }),
//                 api.getLeaderboard('weekly'),
//             ]);

//             if (statsRes.status === 'fulfilled') setStats(statsRes.value);
//             if (callsRes.status === 'fulfilled') setRecentCalls(callsRes.value.logs || callsRes.value.data || []);
//             if (leaderRes.status === 'fulfilled') {
//                 const board = leaderRes.value?.leaderboard || [];
//                 setTeamSize(board.length);
//                 const myIndex = board.findIndex(entry => entry._id?.toString() === user?._id?.toString() || entry.agentEmail === user?.email);
//                 setMyRank(myIndex >= 0 ? myIndex + 1 : null);
//             }
//         } catch (e) { console.log('Salesperson dashboard error:', e); }
//         setLoading(false);
//     };

//     useEffect(() => { fetchDashboard(); }, []);

//     if (loading) return (
//         <div className="flex items-center justify-center h-96">
//             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     const totalCalls = stats?.totalCalls ?? 0;
//     const connected = stats?.connected ?? 0;
//     const missed = stats?.missed ?? 0;
//     const avgDuration = stats?.avgDuration ?? 0;
//     const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

//     const getGreeting = () => {
//         const h = new Date().getHours();
//         if (h < 12) return 'Morning';
//         if (h < 17) return 'Afternoon';
//         return 'Evening';
//     };

//     return (
//         <div className="p-6 max-w-4xl mx-auto space-y-5">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
//                         {(user?.name || 'S').charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                         <p className="text-sm text-gray-500">Good {getGreeting()} 👋</p>
//                         <p className="text-lg font-extrabold text-gray-900">{user?.name || 'Salesperson'}</p>
//                     </div>
//                 </div>
//                 <div className="bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600">
//                     {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                 </div>
//             </div>

//             {/* Today's Performance Banner */}
//             <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 flex items-center justify-between text-white">
//                 <div>
//                     <p className="font-bold text-lg">Today's Performance</p>
//                     <p className="text-indigo-100 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-3xl font-extrabold">{connectRate}%</p>
//                     <p className="text-indigo-100 text-xs">Connect Rate</p>
//                 </div>
//             </div>

//             {/* Rank Badge */}
//             {myRank && (
//                 <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-2xl p-4">
//                     <span className="text-3xl">{myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🏅'}</span>
//                     <div>
//                         <p className="font-extrabold text-amber-800">#{myRank} in Team This Week</p>
//                         <p className="text-amber-600 text-xs">{myRank === 1 ? 'You are the top performer! 🔥' : `${myRank - 1} ahead of you — keep going!`}</p>
//                     </div>
//                     <span className="ml-auto text-amber-600 font-bold">/{teamSize}</span>
//                 </div>
//             )}

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 <StatCard label="Total Calls" value={totalCalls} icon="📞" color="#4F6EF7" soft="#EEF1FE" />
//                 <StatCard label="Connected" value={connected} icon="✅" color="#17C964" soft="#E8FBF0" />
//                 <StatCard label="Missed" value={missed} icon="❌" color="#F31260" soft="#FEE7EF" />
//                 <StatCard label="Avg Duration" value={formatDuration(avgDuration)} icon="⏱️" color="#F5A524" soft="#FFF4E0" />
//             </div>

//             {/* Sync Button */}
//             <button onClick={() => navigate('/salesperson/sync')} className="w-full flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-2xl p-4 hover:bg-teal-100 transition-colors text-left">
//                 <span className="text-2xl">📲</span>
//                 <div className="flex-1">
//                     <p className="font-bold text-teal-700 text-sm">Sync Phone Calls</p>
//                     <p className="text-teal-500 text-xs">Upload today's call logs from your device</p>
//                 </div>
//                 <span className="text-teal-500 text-xl">›</span>
//             </button>

//             {/* Recent Calls */}
//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <p className="font-bold text-gray-800 text-sm">Recent Calls</p>
//                     <button onClick={() => navigate('/salesperson/call-logs')} className="text-indigo-600 text-xs font-bold">View All →</button>
//                 </div>
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     {recentCalls.length === 0 ? (
//                         <div className="p-8 text-center">
//                             <p className="text-gray-400 text-sm">No calls recorded today. Sync your phone to get started.</p>
//                         </div>
//                     ) : (
//                         recentCalls.map((call, i) => <CallRow key={call._id || i} call={call} />)
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
    Phone, PhoneOff, PhoneMissed, Clock, Trophy, TrendingUp,
    BarChart2, History, Smartphone, ChevronRight, ArrowDownLeft, ArrowUpRight,
} from 'lucide-react';
import { StatCard, Card, Badge, Avatar, Button, LoadingPage, SectionHeader, ProgressBar } from '../../components/UI';

const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    const m = Math.floor(seconds / 60), s = seconds % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m}m`;
    return `${m}m ${s}s`;
};

const QUICK_ACTIONS = [
    { icon: Phone, label: 'Call Logs', color: '#3B82F6', bg: '#EFF6FF', path: '/salesperson/call-logs' },
    { icon: History, label: 'My History', color: '#8B5CF6', bg: '#F5F3FF', path: '/salesperson/history' },
    { icon: BarChart2, label: 'Reports', color: '#10B981', bg: '#ECFDF5', path: '/salesperson/reports' },
    { icon: Smartphone, label: 'Sync Calls', color: '#06B6D4', bg: '#ECFEFF', path: '/salesperson/sync' },
    { icon: Trophy, label: 'Leaderboard', color: '#F59E0B', bg: '#FFFBEB', path: '/salesperson/leaderboard' },
];

function CallRow({ call }) {
    const isConnected = call.callStatus === 'Connected';
    const isMissed = call.callStatus === 'Missed' || call.callStatus === 'Rejected';
    const isIncoming = call.callType === 'Incoming';

    const statusColors = {
        Connected: { color: '#10B981', bg: '#ECFDF5', variant: 'green' },
        Missed: { color: '#F43F5E', bg: '#FFF1F2', variant: 'red' },
        Rejected: { color: '#F59E0B', bg: '#FFFBEB', variant: 'yellow' },
    };
    const s = statusColors[call.callStatus] || statusColors.Missed;

    const timeStr = call.calledAt
        ? new Date(call.calledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '—';

    return (
        <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                {isIncoming
                    ? <ArrowDownLeft size={16} style={{ color: s.color }} />
                    : <ArrowUpRight size={16} style={{ color: s.color }} />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                    {call.customerName || call.customerNumber || 'Unknown'}
                </p>
                <p className="text-xs text-slate-400">{call.callType} · {timeStr}</p>
            </div>
            <div className="text-right shrink-0">
                {isConnected && <p className="text-xs text-slate-500 font-medium">{formatDuration(call.durationSeconds)}</p>}
                <Badge variant={s.variant} className="mt-0.5">{call.callStatus}</Badge>
            </div>
        </div>
    );
}

export default function SalespersonDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [myRank, setMyRank] = useState(null);
    const [teamSize, setTeamSize] = useState(0);
    const [recentCalls, setRecentCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    const todayDate = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [statsRes, callsRes, leaderRes] = await Promise.allSettled([
                    api.getCallStats({ dateFrom: todayDate(), dateTo: todayDate() }),
                    api.getCallLogs({ page: 1, limit: 5, sortField: 'calledAt', sortDir: 'desc' }),
                    api.getLeaderboard('weekly'),
                ]);
                if (statsRes.status === 'fulfilled') setStats(statsRes.value);
                if (callsRes.status === 'fulfilled') setRecentCalls(callsRes.value.logs || callsRes.value.data || []);
                if (leaderRes.status === 'fulfilled') {
                    const board = leaderRes.value?.leaderboard || [];
                    setTeamSize(board.length);
                    const myIndex = board.findIndex(e =>
                        e._id?.toString() === user?._id?.toString() || e.agentEmail === user?.email
                    );
                    setMyRank(myIndex >= 0 ? myIndex + 1 : null);
                }
            } catch (e) { console.log(e); }
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    if (loading) return <LoadingPage />;

    const totalCalls = stats?.total ?? stats?.totalCalls ?? 0;
    const connected  = stats?.connected ?? 0;
    const missed     = stats?.missed ?? 0;
    const avgDuration = stats?.avgDuration ?? 0;
    const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1a2e4a] rounded-2xl p-5 text-white overflow-hidden relative">
                <div className="absolute top-[-30px] right-[-30px] w-[160px] h-[160px] rounded-full bg-blue-500/10" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar name={user?.name || 'S'} size="xl" />
                        <div>
                            <p className="text-blue-200 text-sm">{getGreeting()} 👋</p>
                            <h2 className="text-lg font-bold mt-0.5">{user?.name || 'Salesperson'}</h2>
                            <p className="text-blue-200/70 text-xs mt-1">
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    {myRank && (
                        <div className="text-center shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-1">
                                <Trophy size={22} className="text-amber-400" />
                            </div>
                            <p className="text-white font-bold">#{myRank}</p>
                            <p className="text-blue-200 text-[11px]">of {teamSize}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Performance */}
            <div>
                <SectionHeader title="Today's Performance" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Calls" value={totalCalls} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                    <StatCard label="Connected" value={connected} icon={TrendingUp} color="#10B981" bgColor="#ECFDF5" />
                    <StatCard label="Missed" value={missed} icon={PhoneMissed} color="#F43F5E" bgColor="#FFF1F2" />
                    <StatCard label="Avg Duration" value={formatDuration(avgDuration)} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" />
                </div>
            </div>

            {/* Connection Rate */}
            <Card>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={17} className="text-emerald-500" />
                        <p className="text-sm font-semibold text-slate-700">Today's Connection Rate</p>
                    </div>
                    <p className="text-base font-bold" style={{ color: connectRate >= 50 ? '#10B981' : '#F43F5E' }}>
                        {connectRate}%
                    </p>
                </div>
                <ProgressBar value={connectRate} max={100} color={connectRate >= 50 ? '#10B981' : '#F43F5E'} height={8} />
                <p className="text-xs text-slate-400 mt-2">{connected} connected out of {totalCalls} total calls</p>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Calls */}
                <Card padding={false}>
                    <div className="p-5 border-b border-slate-50">
                        <SectionHeader
                            title="Recent Calls"
                            action={
                                <Button variant="ghost" size="xs" onClick={() => navigate('/salesperson/call-logs')} icon={ChevronRight}>
                                    View all
                                </Button>
                            }
                        />
                    </div>
                    {recentCalls.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-10">No recent calls</p>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {recentCalls.map((call, i) => <CallRow key={call._id || i} call={call} />)}
                        </div>
                    )}
                </Card>

                {/* Quick Actions */}
                <div>
                    <SectionHeader title="Quick Actions" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.path}
                                    onClick={() => navigate(action.path)}
                                    className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.bg }}>
                                        <Icon size={20} style={{ color: action.color }} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">{action.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}