// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { api } from '../../services/api';

// const StatCard = ({ label, value, icon, color, soft, sub }) => (
//     <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" style={{ borderTopColor: color, borderTopWidth: 3 }}>
//         <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: soft }}>{icon}</div>
//         <p className="text-3xl font-extrabold text-gray-900">{value ?? '0'}</p>
//         <p className="text-sm text-gray-500 mt-1">{label}</p>
//         {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
//     </div>
// );

// const AgentRow = ({ agent, index }) => {
//     const colors = ['#4A68F0', '#7322C0', '#16BE62', '#F0204E', '#F0991A', '#0AAECC'];
//     return (
//         <div className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
//             <div className="w-8 text-center">
//                 <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
//             </div>
//             <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: colors[index % colors.length] }}>
//                 {(agent.name || '?').charAt(0).toUpperCase()}
//             </div>
//             <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-800 text-sm truncate">{agent.name}</p>
//                 <p className="text-xs text-gray-400">{agent.connectedCalls} connected · {agent.totalCalls} total</p>
//             </div>
//             <p className="text-lg font-extrabold text-indigo-600">{agent.totalCalls}</p>
//         </div>
//     );
// };

// export default function BusinessDashboard() {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [teamStats, setTeamStats] = useState(null);
//     const [agents, setAgents] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchStats = async () => {
//         try {
//             const res = await api.getTeamCallStats();
//             if (res) {
//                 setTeamStats(res.summary || res);
//                 setAgents(res.agents || []);
//             }
//         } catch (e) { console.log('Business dashboard error:', e); }
//         finally { setLoading(false); }
//     };

//     useEffect(() => { fetchStats(); }, []);

//     if (loading) return (
//         <div className="flex items-center justify-center h-96">
//             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
//     const totalCalls = teamStats?.totalCalls || 0;
//     const connected = teamStats?.connectedCalls || 0;
//     const missed = teamStats?.missedCalls || 0;
//     const avgDuration = teamStats?.avgDuration ? `${teamStats.avgDuration}s` : '0s';
//     const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

//     const quickActions = [
//         { icon: '📞', label: 'Call Logs', color: '#006FEE', soft: '#E6F1FE', path: '/business/call-logs' },
//         { icon: '🔴', label: 'Live Feed', color: '#F31260', soft: '#FEE7EF', path: '/business/live-feed' },
//         { icon: '📊', label: 'Reports', color: '#7828C8', soft: '#F0E6FF', path: '/business/reports' },
//         { icon: '📲', label: 'Sync Calls', color: '#17C964', soft: '#E8FBF0', path: '/business/sync' },
//         { icon: '🏆', label: 'Leaderboard', color: '#F5A524', soft: '#FFF4E0', path: '/business/leaderboard' },
//     ];

//     return (
//         <div className="p-6 max-w-5xl mx-auto space-y-5">
//             {/* Header */}
//             <div>
//                 <p className="text-sm text-gray-500">Hello, {user?.name?.split(' ')[0] || 'Team Lead'} 👋</p>
//                 <h2 className="text-2xl font-extrabold text-gray-900 mt-0.5">{today}</h2>
//             </div>

//             {/* Team Stats */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Today's Team Overview</p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <StatCard label="Total Calls" value={totalCalls} icon="📞" color="#006FEE" soft="#E6F1FE" sub="All calls today" />
//                     <StatCard label="Connected" value={connected} icon="✅" color="#17C964" soft="#E8FBF0" sub="Picked up" />
//                     <StatCard label="Missed" value={missed} icon="📵" color="#F31260" soft="#FEE7EF" sub="Not answered" />
//                     <StatCard label="Avg Duration" value={avgDuration} icon="⏱️" color="#7828C8" soft="#F0E6FF" sub="Per call" />
//                 </div>
//             </div>

//             {/* Connection Rate */}
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-sm text-gray-600">Team Connection Rate</p>
//                     <p className="text-lg font-extrabold text-green-600">{connectRate}%</p>
//                 </div>
//                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                     <div className="h-2 rounded-full bg-green-500" style={{ width: `${connectRate}%` }} />
//                 </div>
//             </div>

//             {/* Agent Performance */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Agent Performance</p>
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                     {agents.length === 0 ? (
//                         <p className="text-gray-400 text-sm text-center py-10">No agent data available</p>
//                     ) : (
//                         agents.map((agent, i) => <AgentRow key={agent._id || i} agent={agent} index={i} />)
//                     )}
//                 </div>
//             </div>

//             {/* Quick Actions */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                     {quickActions.map(a => (
//                         <button key={a.label} onClick={() => navigate(a.path)} className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity" style={{ backgroundColor: a.soft }}>
//                             <span className="text-2xl">{a.icon}</span>
//                             <span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span>
//                         </button>
//                     ))}
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
    Phone, PhoneOff, PhoneMissed, Clock, Radio, Users, BarChart2,
    Smartphone, Trophy, TrendingUp, ChevronRight,
} from 'lucide-react';
import { StatCard, Card, Avatar, Button, LoadingPage, SectionHeader, ProgressBar } from '../../components/UI';

const QUICK_ACTIONS = [
    { icon: Phone, label: 'Call Logs', color: '#3B82F6', bg: '#EFF6FF', path: '/business/call-logs' },
    { icon: Radio, label: 'Live Feed', color: '#F43F5E', bg: '#FFF1F2', path: '/business/live-feed' },
    { icon: BarChart2, label: 'Reports', color: '#8B5CF6', bg: '#F5F3FF', path: '/business/reports' },
    { icon: Smartphone, label: 'Sync Calls', color: '#10B981', bg: '#ECFDF5', path: '/business/sync' },
    { icon: Trophy, label: 'Leaderboard', color: '#F59E0B', bg: '#FFFBEB', path: '/business/leaderboard' },
];

export default function BusinessDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [teamStats, setTeamStats] = useState(null);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.getTeamCallStats();
                if (res) { setTeamStats(res.summary || res); setAgents(res.agents || []); }
            } catch (e) { console.log(e); }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <LoadingPage />;

    const totalCalls = teamStats?.totalCalls || 0;
    const connected = teamStats?.connectedCalls || 0;
    const missed = teamStats?.missedCalls || 0;
    const avgDuration = teamStats?.avgDuration || 0;
    const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const fmtDuration = (s) => {
        if (!s) return '0s';
        const m = Math.floor(s / 60), sec = s % 60;
        return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    };

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-blue-500/10" />
                <div className="absolute bottom-[-30px] left-[40%] w-[140px] h-[140px] rounded-full bg-cyan-500/10" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-blue-200 text-sm">{getGreeting()}, {user?.name?.split(' ')[0] || 'Team Lead'} 👋</p>
                        <h2 className="text-xl font-bold mt-1">{today}</h2>
                        <p className="text-blue-100 text-sm mt-2 opacity-80">Here's your team's performance overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{connectRate}%</p>
                            <p className="text-blue-200 text-xs mt-0.5">Connection Rate</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{agents.length}</p>
                            <p className="text-blue-200 text-xs mt-0.5">Active Agents</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div>
                <SectionHeader title="Today's Team Overview" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Calls" value={totalCalls} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" sub="All calls today" />
                    <StatCard label="Connected" value={connected} icon={PhoneMissed} color="#10B981" bgColor="#ECFDF5" sub="Answered" />
                    <StatCard label="Missed" value={missed} icon={PhoneOff} color="#F43F5E" bgColor="#FFF1F2" sub="Not answered" />
                    <StatCard label="Avg Duration" value={fmtDuration(avgDuration)} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" sub="Per call" />
                </div>
            </div>

            {/* Connection Rate */}
            <Card>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" />
                        <p className="text-sm font-semibold text-slate-700">Team Connection Rate</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">{connectRate}%</p>
                </div>
                <ProgressBar value={connectRate} max={100} color="#10B981" height={8} />
                <p className="text-xs text-slate-400 mt-2">{connected} of {totalCalls} calls connected today</p>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Agent Performance */}
                <Card padding={false}>
                    <div className="p-5 border-b border-slate-50">
                        <SectionHeader
                            title="Agent Performance"
                            action={
                                <Button variant="ghost" size="xs" onClick={() => navigate('/business/leaderboard')} icon={ChevronRight}>
                                    Full Leaderboard
                                </Button>
                            }
                        />
                    </div>
                    {agents.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-10">No agent data available</p>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {agents.slice(0, 6).map((agent, i) => {
                                const rate = agent.totalCalls > 0 ? Math.round((agent.connectedCalls / agent.totalCalls) * 100) : 0;
                                return (
                                    <div key={agent._id || i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                        <span className="text-xs font-bold text-slate-300 w-5 shrink-0">#{i + 1}</span>
                                        <Avatar name={agent.name} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{agent.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ProgressBar value={rate} max={100} color="#3B82F6" height={4} />
                                                <span className="text-xs text-slate-400 shrink-0">{rate}%</span>
                                            </div>
                                        </div>
                                        <p className="text-base font-bold text-blue-600 shrink-0">{agent.totalCalls}</p>
                                    </div>
                                );
                            })}
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