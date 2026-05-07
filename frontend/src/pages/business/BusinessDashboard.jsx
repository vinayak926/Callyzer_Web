import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';

const StatCard = ({ label, value, icon, color, soft, sub }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" style={{ borderTopColor: color, borderTopWidth: 3 }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: soft }}>{icon}</div>
        <p className="text-3xl font-extrabold text-gray-900">{value ?? '0'}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
);

const AgentRow = ({ agent, index }) => {
    const colors = ['#4A68F0', '#7322C0', '#16BE62', '#F0204E', '#F0991A', '#0AAECC'];
    return (
        <div className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="w-8 text-center">
                <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: colors[index % colors.length] }}>
                {(agent.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{agent.name}</p>
                <p className="text-xs text-gray-400">{agent.connectedCalls} connected · {agent.totalCalls} total</p>
            </div>
            <p className="text-lg font-extrabold text-indigo-600">{agent.totalCalls}</p>
        </div>
    );
};

export default function BusinessDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [teamStats, setTeamStats] = useState(null);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.getTeamCallStats();
            if (res) {
                setTeamStats(res.summary || res);
                setAgents(res.agents || []);
            }
        } catch (e) { console.log('Business dashboard error:', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    const totalCalls = teamStats?.totalCalls || 0;
    const connected = teamStats?.connectedCalls || 0;
    const missed = teamStats?.missedCalls || 0;
    const avgDuration = teamStats?.avgDuration ? `${teamStats.avgDuration}s` : '0s';
    const connectRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

    const quickActions = [
        { icon: '📞', label: 'Call Logs', color: '#006FEE', soft: '#E6F1FE', path: '/business/call-logs' },
        { icon: '🔴', label: 'Live Feed', color: '#F31260', soft: '#FEE7EF', path: '/business/live-feed' },
        { icon: '📊', label: 'Reports', color: '#7828C8', soft: '#F0E6FF', path: '/business/reports' },
        { icon: '📲', label: 'Sync Calls', color: '#17C964', soft: '#E8FBF0', path: '/business/sync' },
        { icon: '🏆', label: 'Leaderboard', color: '#F5A524', soft: '#FFF4E0', path: '/business/leaderboard' },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-5">
            {/* Header */}
            <div>
                <p className="text-sm text-gray-500">Hello, {user?.name?.split(' ')[0] || 'Team Lead'} 👋</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-0.5">{today}</h2>
            </div>

            {/* Team Stats */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Today's Team Overview</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Calls" value={totalCalls} icon="📞" color="#006FEE" soft="#E6F1FE" sub="All calls today" />
                    <StatCard label="Connected" value={connected} icon="✅" color="#17C964" soft="#E8FBF0" sub="Picked up" />
                    <StatCard label="Missed" value={missed} icon="📵" color="#F31260" soft="#FEE7EF" sub="Not answered" />
                    <StatCard label="Avg Duration" value={avgDuration} icon="⏱️" color="#7828C8" soft="#F0E6FF" sub="Per call" />
                </div>
            </div>

            {/* Connection Rate */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Team Connection Rate</p>
                    <p className="text-lg font-extrabold text-green-600">{connectRate}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: `${connectRate}%` }} />
                </div>
            </div>

            {/* Agent Performance */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Agent Performance</p>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {agents.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-10">No agent data available</p>
                    ) : (
                        agents.map((agent, i) => <AgentRow key={agent._id || i} agent={agent} index={i} />)
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {quickActions.map(a => (
                        <button key={a.label} onClick={() => navigate(a.path)} className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity" style={{ backgroundColor: a.soft }}>
                            <span className="text-2xl">{a.icon}</span>
                            <span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}