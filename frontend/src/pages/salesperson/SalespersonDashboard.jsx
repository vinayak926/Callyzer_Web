// ============================================
// SALESPERSON DASHBOARD — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • StatCard: bg-card/dark:bg-card-dark with colored icon pills, no inline styles
//   • Performance banner: gradient from-primary to-accent
//   • Rank badge: warning-soft tones, dark mode support
//   • CallRow: theme-aware status colors, no inline styles
//   • Sync CTA: accent-tinted card with hover lift
//   • Recent calls: bg-card/dark:bg-card-dark glass card
//   • Loading: themed spinner
//   • dark: variant on EVERY element
// UNCHANGED: All state, API calls, logic, data processing
// ============================================

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';

const STAT_STYLES = {
    total:    { icon: '📞', border: 'border-t-primary',  bg: 'bg-primary-soft dark:bg-primary/10' },
    connect:  { icon: '✅', border: 'border-t-success',  bg: 'bg-success-soft dark:bg-success/10' },
    missed:   { icon: '❌', border: 'border-t-danger',   bg: 'bg-danger-soft dark:bg-danger/10' },
    duration: { icon: '⏱️', border: 'border-t-warning',  bg: 'bg-warning-soft dark:bg-warning/10' },
};

const StatCard = ({ label, value, icon, theme }) => (
    <div className={`bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl p-4 shadow-card dark:shadow-none border border-line dark:border-white/5 text-center border-t-[3px] ${theme.border} hover:shadow-elevated hover:scale-[1.02] transition-all duration-300`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-2 ${theme.bg}`}>{icon}</div>
        <p className="text-2xl font-extrabold text-heading dark:text-heading-dark">{value ?? '0'}</p>
        <p className="text-xs text-subtle dark:text-subtle-dark mt-0.5 tracking-wide">{label}</p>
    </div>
);

const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m}m`;
    return `${m}m ${s}s`;
};

const CallRow = ({ call }) => {
    const isConnected = call.callStatus === 'Connected';
    const isMissed = call.callStatus === 'Missed' || call.callStatus === 'Rejected';

    const statusClass = isConnected ? 'text-success' : isMissed ? 'text-danger' : 'text-subtle dark:text-subtle-dark';
    const iconBg = isConnected ? 'bg-success-soft dark:bg-success/10' : isMissed ? 'bg-danger-soft dark:bg-danger/10' : 'bg-raised dark:bg-raised-dark';
    const icon = isConnected ? '✅' : isMissed ? '❌' : '📞';

    const timeStr = call.calledAt ? new Date(call.calledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line dark:border-line-dark last:border-0 hover:bg-hover-bg dark:hover:bg-hover-bg-dark transition-colors duration-150">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${iconBg}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-heading dark:text-heading-dark text-sm truncate">{call.customerName || call.customerNumber || 'Unknown'}</p>
                <p className="text-xs text-subtle dark:text-subtle-dark">{call.callType} · {timeStr}</p>
            </div>
            <div className="text-right">
                {isConnected && <p className="text-xs font-semibold text-body dark:text-body-dark">{formatDuration(call.durationSeconds)}</p>}
                <p className={`text-xs font-bold ${statusClass}`}>{call.callStatus}</p>
            </div>
        </div>
    );
};

export default function SalespersonDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [myRank, setMyRank] = useState(null);
    const [teamSize, setTeamSize] = useState(0);
    const [recentCalls, setRecentCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    const todayDate = () => new Date().toISOString().split('T')[0];

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
                const myIndex = board.findIndex(entry => entry._id?.toString() === user?._id?.toString() || entry.agentEmail === user?.email);
                setMyRank(myIndex >= 0 ? myIndex + 1 : null);
            }
        } catch (e) { console.log('Salesperson dashboard error:', e); }
        setLoading(false);
    };

    useEffect(() => { fetchDashboard(); }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const totalCalls = stats?.totalCalls ?? 0;
    const connected = stats?.connected ?? 0;
    const missed = stats?.missed ?? 0;
    const avgDuration = stats?.avgDuration ?? 0;
    const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Morning';
        if (h < 17) return 'Afternoon';
        return 'Evening';
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-role-sales-soft flex items-center justify-center text-role-sales font-bold text-lg">
                        {(user?.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm text-subtle dark:text-subtle-dark">Good {getGreeting()} 👋</p>
                        <p className="text-lg font-extrabold text-heading dark:text-heading-dark tracking-tight">{user?.name || 'Salesperson'}</p>
                    </div>
                </div>
                <div className="bg-primary-soft dark:bg-primary/15 px-3 py-1.5 rounded-full text-xs font-bold text-primary dark:text-primary-light">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
            </div>

            {/* ── Performance Banner ── */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-5 flex items-center justify-between text-white shadow-glow-lg">
                <div>
                    <p className="font-bold text-lg tracking-tight">Today's Performance</p>
                    <p className="text-white/70 text-xs mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-extrabold">{connectRate}%</p>
                    <p className="text-white/70 text-xs">Connect Rate</p>
                </div>
            </div>

            {/* ── Rank Badge ── */}
            {myRank && (
                <div className="flex items-center gap-3 bg-warning-soft dark:bg-warning/10 border border-warning/20 dark:border-warning/15 rounded-2xl p-4 hover:shadow-elevated transition-all duration-300">
                    <span className="text-3xl">{myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🏅'}</span>
                    <div>
                        <p className="font-extrabold text-heading dark:text-heading-dark">#{myRank} in Team This Week</p>
                        <p className="text-warning dark:text-warning text-xs">{myRank === 1 ? 'You are the top performer! 🔥' : `${myRank - 1} ahead of you — keep going!`}</p>
                    </div>
                    <span className="ml-auto text-warning font-bold">/{teamSize}</span>
                </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Calls" value={totalCalls} icon="📞" theme={STAT_STYLES.total} />
                <StatCard label="Connected" value={connected} icon="✅" theme={STAT_STYLES.connect} />
                <StatCard label="Missed" value={missed} icon="❌" theme={STAT_STYLES.missed} />
                <StatCard label="Avg Duration" value={formatDuration(avgDuration)} icon="⏱️" theme={STAT_STYLES.duration} />
            </div>

            {/* ── Sync CTA ── */}
            <button onClick={() => navigate('/salesperson/sync')} className="w-full flex items-center gap-3 bg-accent-soft dark:bg-accent/10 border border-accent/15 dark:border-accent/20 rounded-2xl p-4 hover:bg-accent/15 dark:hover:bg-accent/15 hover:shadow-elevated hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-left cursor-pointer">
                <span className="text-2xl">📲</span>
                <div className="flex-1">
                    <p className="font-bold text-accent-hover dark:text-accent-light text-sm">Sync Phone Calls</p>
                    <p className="text-accent dark:text-accent text-xs opacity-70">Upload today's call logs from your device</p>
                </div>
                <span className="text-accent text-xl">›</span>
            </button>

            {/* ── Recent Calls ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-heading dark:text-heading-dark text-sm tracking-tight">Recent Calls</p>
                    <button onClick={() => navigate('/salesperson/call-logs')} className="text-primary dark:text-primary-light text-xs font-bold hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer">View All →</button>
                </div>
                <div className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl rounded-2xl border border-line dark:border-white/5 shadow-card dark:shadow-none overflow-hidden transition-colors duration-300">
                    {recentCalls.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-3xl mb-2">📭</p>
                            <p className="text-subtle dark:text-subtle-dark text-sm font-medium">No calls recorded today</p>
                            <p className="text-subtle dark:text-subtle-dark text-xs mt-1">Sync your phone to get started.</p>
                        </div>
                    ) : (
                        recentCalls.map((call, i) => <CallRow key={call._id || i} call={call} />)
                    )}
                </div>
            </div>
        </div>
    );
}