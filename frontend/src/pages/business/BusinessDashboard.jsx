// ============================================
// BUSINESS DASHBOARD — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • StatCard: Tailwind-only colors, no inline styles
//   • AgentRow: Tailwind avatar colors, no inline styles
//   • Connection Rate: themed progress bar
//   • Quick Actions: Tailwind bg/text, hover lift, no inline styles
//   • All cards: bg-card/dark:bg-card-dark glassmorphic
//   • Empty states: icon + heading + subtext
//   • dark: variant on EVERY element
// UNCHANGED: All state, API calls, logic, data processing
// ============================================

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { api } from '../../services/api';

// const STAT_THEMES = {
//     total:    { border: 'border-t-info',     bg: 'bg-info-soft dark:bg-info/10' },
//     connect:  { border: 'border-t-success',  bg: 'bg-success-soft dark:bg-success/10' },
//     missed:   { border: 'border-t-danger',   bg: 'bg-danger-soft dark:bg-danger/10' },
//     duration: { border: 'border-t-primary',  bg: 'bg-primary-soft dark:bg-primary/10' },
// };

// const StatCard = ({ label, value, icon, theme, sub }) => (
//     <div className={`bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl p-5 shadow-card dark:shadow-none border border-line dark:border-white/5 border-t-[3px] ${theme.border} hover:shadow-elevated hover:scale-[1.02] transition-all duration-300`}>
//         <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${theme.bg}`}>{icon}</div>
//         <p className="text-3xl font-extrabold text-heading dark:text-heading-dark">{value ?? '0'}</p>
//         <p className="text-sm text-body dark:text-body-dark mt-1">{label}</p>
//         {sub && <p className="text-xs text-subtle dark:text-subtle-dark mt-0.5">{sub}</p>}
//     </div>
// );

// const AVATAR_COLORS = [
//     'bg-primary',
//     'bg-role-admin',
//     'bg-success',
//     'bg-danger',
//     'bg-warning',
//     'bg-accent',
// ];

// const AgentRow = ({ agent, index }) => (
//     <div className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-line dark:border-line-dark' : ''} hover:bg-hover-bg dark:hover:bg-hover-bg-dark transition-colors duration-150`}>
//         <div className="w-8 text-center">
//             <span className="text-xs font-bold text-subtle dark:text-subtle-dark">#{index + 1}</span>
//         </div>
//         <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${AVATAR_COLORS[index % AVATAR_COLORS.length]} shadow-card`}>
//             {(agent.name || '?').charAt(0).toUpperCase()}
//         </div>
//         <div className="flex-1 min-w-0">
//             <p className="font-semibold text-heading dark:text-heading-dark text-sm truncate">{agent.name}</p>
//             <p className="text-xs text-subtle dark:text-subtle-dark">{agent.connectedCalls} connected · {agent.totalCalls} total</p>
//         </div>
//         <p className="text-lg font-extrabold text-primary dark:text-primary-light">{agent.totalCalls}</p>
//     </div>
// );

// const QUICK_ACTIONS = [
//     { icon: '📞', label: 'Call Logs',    tw: 'bg-info-soft dark:bg-info/10 text-info',            path: '/business/call-logs' },
//     { icon: '🔴', label: 'Live Feed',    tw: 'bg-danger-soft dark:bg-danger/10 text-danger',      path: '/business/live-feed' },
//     { icon: '📊', label: 'Reports',      tw: 'bg-primary-soft dark:bg-primary/10 text-primary dark:text-primary-light', path: '/business/reports' },
//     { icon: '📲', label: 'Sync Calls',   tw: 'bg-success-soft dark:bg-success/10 text-success',   path: '/business/sync' },
//     { icon: '🏆', label: 'Leaderboard',  tw: 'bg-warning-soft dark:bg-warning/10 text-warning',   path: '/business/leaderboard' },
// ];

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
//             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
//     const totalCalls = teamStats?.totalCalls || 0;
//     const connected = teamStats?.connectedCalls || 0;
//     const missed = teamStats?.missedCalls || 0;
//     const avgDuration = teamStats?.avgDuration ? `${teamStats.avgDuration}s` : '0s';
//     const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

//     const quickActions = QUICK_ACTIONS;

//     return (
//         <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 animate-fade-in">

//             {/* ── Header ── */}
//             <div>
//                 <p className="text-sm text-subtle dark:text-subtle-dark">Hello, {user?.name?.split(' ')[0] || 'Team Lead'} 👋</p>
//                 <h2 className="text-2xl font-extrabold text-heading dark:text-heading-dark mt-0.5 tracking-tight">{today}</h2>
//             </div>

//             {/* ── Team Stats ── */}
//             <div>
//                 <p className="text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-3">Today's Team Overview</p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <StatCard label="Total Calls" value={totalCalls} icon="📞" theme={STAT_THEMES.total} sub="All calls today" />
//                     <StatCard label="Connected" value={connected} icon="✅" theme={STAT_THEMES.connect} sub="Picked up" />
//                     <StatCard label="Missed" value={missed} icon="📵" theme={STAT_THEMES.missed} sub="Not answered" />
//                     <StatCard label="Avg Duration" value={avgDuration} icon="⏱️" theme={STAT_THEMES.duration} sub="Per call" />
//                 </div>
//             </div>

//             {/* ── Connection Rate ── */}
//             <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl p-5 shadow-card dark:shadow-none border border-line dark:border-white/5 transition-colors duration-300">
//                 <div className="flex items-center justify-between mb-3">
//                     <p className="text-sm text-body dark:text-body-dark font-medium">Team Connection Rate</p>
//                     <p className="text-lg font-extrabold text-success">{connectRate}%</p>
//                 </div>
//                 <div className="h-2.5 bg-raised dark:bg-raised-dark rounded-full overflow-hidden">
//                     <div
//                         className="h-2.5 rounded-full bg-gradient-to-r from-success to-accent transition-all duration-700 ease-out"
//                         style={{ width: `${connectRate}%` }}
//                     />
//                 </div>
//             </div>

//             {/* ── Agent Performance ── */}
//             <div>
//                 <p className="text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-3">Agent Performance</p>
//                 <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl shadow-card dark:shadow-none border border-line dark:border-white/5 overflow-hidden transition-colors duration-300">
//                     {agents.length === 0 ? (
//                         <div className="p-10 text-center">
//                             <p className="text-3xl mb-2">👥</p>
//                             <p className="text-body dark:text-body-dark text-sm font-medium">No agent data available</p>
//                             <p className="text-subtle dark:text-subtle-dark text-xs mt-1">Team data will appear once calls are synced.</p>
//                         </div>
//                     ) : (
//                         agents.map((agent, i) => <AgentRow key={agent._id || i} agent={agent} index={i} />)
//                     )}
//                 </div>
//             </div>

//             {/* ── Quick Actions ── */}
//             <div>
//                 <p className="text-xs font-semibold text-subtle dark:text-subtle-dark uppercase tracking-widest mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
//                     {quickActions.map(a => (
//                         <button
//                             key={a.label}
//                             onClick={() => navigate(a.path)}
//                             className={`rounded-2xl p-4 flex flex-col items-center gap-2 border border-transparent hover:border-line dark:hover:border-line-dark hover:shadow-elevated hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer ${a.tw.split(' ').filter(c => !c.startsWith('text-')).join(' ')}`}
//                         >
//                             <span className="text-2xl">{a.icon}</span>
//                             <span className={`text-xs font-bold ${a.tw.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>{a.label}</span>
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