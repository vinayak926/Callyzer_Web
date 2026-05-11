// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { api } from '../../services/api';

// const ROLE_COLORS = {
//     super_admin:   { color: '#7322C0', soft: '#F1E8FC', label: 'Super Admin' },
//     business_user: { color: '#16BE62', soft: '#E5F9EF', label: 'Business User' },
//     salesperson:   { color: '#0A6EEA', soft: '#E5F1FE', label: 'Salesperson' },
//     default:       { color: '#0A6EEA', soft: '#E5F1FE', label: 'User' },
// };

// function StatCard({ label, value, icon, color, soft, sub }) {
//     return (
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100" style={{ borderTopColor: color, borderTopWidth: 3 }}>
//             <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: soft }}>
//                 {icon}
//             </div>
//             <p className="text-3xl font-extrabold text-gray-900">{value ?? '0'}</p>
//             <p className="text-sm text-gray-500 mt-1">{label}</p>
//             {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
//         </div>
//     );
// }

// export default function AdminDashboard() {
//     const { logout } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [stats, setStats] = useState(null);
//     const [recentUsers, setRecentUsers] = useState([]);
//     const [pendingCount, setPendingCount] = useState(0);
//     const [loading, setLoading] = useState(true);

//     const fetchAll = async () => {
//         try {
//             const [statsRes, usersRes, pendingRes] = await Promise.allSettled([
//                 api.getAdminStats(),
//                 api.getAdminRecentUsers(),
//                 api.getPendingApprovals(),
//             ]);
//             if (statsRes.status === 'fulfilled') setStats(statsRes.value);
//             if (usersRes.status === 'fulfilled') setRecentUsers(usersRes.value.users || []);
//             if (pendingRes.status === 'fulfilled') setPendingCount(pendingRes.value.count || 0);
//         } catch (e) { console.log(e); }
//         finally { setLoading(false); }
//     };

//     useEffect(() => { fetchAll(); }, []);

//     if (loading) return (
//         <div className="flex items-center justify-center h-96">
//             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     const roleCounts = stats?.roleCounts || {};
//     const quickActions = [
//         { icon: '👥', label: 'Users',       color: '#0A6EEA', soft: '#E5F1FE', path: '/admin/users' },
//         { icon: '⏳', label: 'Approvals',   color: '#F0991A', soft: '#FEF4E5', path: '/admin/approvals' },
//         { icon: '📞', label: 'Call Logs',   color: '#16BE62', soft: '#E5F9EF', path: '/admin/call-logs' },
//         { icon: '📊', label: 'Reports',     color: '#7322C0', soft: '#F1E8FC', path: '/admin/reports' },
//         { icon: '⚙️', label: 'Settings',    color: '#F0991A', soft: '#FEF4E5', path: '/admin/settings' },
//     ];

//     return (
//         <div className="p-6 max-w-5xl mx-auto space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-2xl font-extrabold text-gray-900">Super Admin Overview</h2>
//                     <p className="text-gray-500 text-sm mt-0.5">
//                         {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
//                     </p>
//                 </div>
//                 <button onClick={() => { logout(); navigate('/login'); }}
//                     className="bg-red-50 text-red-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
//                     Sign out
//                 </button>
//             </div>

//             {/* Stats Grid */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Overview</p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <StatCard label="Total Users"    value={stats?.totalUsers}       icon="👥" color="#0A6EEA" soft="#E5F1FE" sub="All accounts" />
//                     <StatCard label="Active Users"   value={stats?.activeUsers}      icon="✅" color="#16BE62" soft="#E5F9EF" sub="Enabled" />
//                     <StatCard label="New This Week"  value={stats?.newUsersThisWeek} icon="🆕" color="#7322C0" soft="#F1E8FC" sub="Last 7 days" />
//                     <StatCard label="Active Today"   value={stats?.recentlyActive}   icon="🟢" color="#F0991A" soft="#FEF4E5" sub="Last 24 hrs" />
//                 </div>
//             </div>

//             {/* Pending Banner */}
//             {pendingCount > 0 && (
//                 <button
//                     onClick={() => navigate('/admin/approvals')}
//                     className="w-full flex items-center justify-between bg-amber-50 border border-amber-300 rounded-2xl p-4 hover:bg-amber-100 transition-colors text-left"
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⏳</div>
//                         <div>
//                             <p className="font-bold text-amber-900 text-sm">{pendingCount} Pending Approval{pendingCount !== 1 ? 's' : ''}</p>
//                             <p className="text-amber-700 text-xs">Tap to review and approve accounts</p>
//                         </div>
//                     </div>
//                     <span className="text-amber-500 text-xl">›</span>
//                 </button>
//             )}

//             {/* Role Breakdown */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Users by Role</p>
//                 <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
//                     {Object.entries(ROLE_COLORS).map(([key, cfg]) => {
//                         const count = roleCounts[key] || 0;
//                         if (!count || key === 'default') return null;
//                         const pct = stats?.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
//                         return (
//                             <div key={key} className="flex items-center gap-3">
//                                 <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
//                                 <span className="text-sm text-gray-600 w-28">{cfg.label}</span>
//                                 <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                                     <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
//                                 </div>
//                                 <span className="text-sm font-bold w-6 text-right" style={{ color: cfg.color }}>{count}</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Quick Actions */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
//                     {quickActions.map(a => (
//                         <button key={a.label} onClick={() => navigate(a.path)}
//                             className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
//                             style={{ backgroundColor: a.soft }}
//                         >
//                             <span className="text-2xl">{a.icon}</span>
//                             <span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Recently Joined */}
//             <div>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recently Joined</p>
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                     {recentUsers.length === 0 ? (
//                         <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
//                     ) : recentUsers.map((u, i) => {
//                         const cfg = ROLE_COLORS[u.role] || ROLE_COLORS.default;
//                         return (
//                             <div key={u._id} className={`flex items-center px-5 py-3.5 ${i < recentUsers.length - 1 ? 'border-b border-gray-100' : ''}`}>
//                                 <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mr-3" style={{ backgroundColor: cfg.soft, color: cfg.color }}>
//                                     {u.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-semibold text-gray-900">{u.name}</p>
//                                     <p className="text-xs text-gray-500 truncate">{u.email}</p>
//                                 </div>
//                                 <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.soft, color: cfg.color }}>
//                                     {cfg.label}
//                                 </span>
//                             </div>
//                         );
//                     })}
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
    Users, UserCheck, UserPlus, Activity, Clock, ChevronRight,
    ShieldCheck, Phone, BarChart2, Settings, ClipboardCheck, Trophy,
} from 'lucide-react';
import { StatCard, Card, Badge, Avatar, Button, LoadingPage, SectionHeader } from '../../components/UI';

const ROLE_CONFIG = {
    super_admin: { color: '#8B5CF6', bg: '#F5F3FF', label: 'Super Admin' },
    business_user: { color: '#10B981', bg: '#ECFDF5', label: 'Business User' },
    salesperson: { color: '#3B82F6', bg: '#EFF6FF', label: 'Salesperson' },
};

const QUICK_ACTIONS = [
    { icon: Users, label: 'Users', color: '#3B82F6', bg: '#EFF6FF', path: '/admin/users' },
    { icon: ClipboardCheck, label: 'Approvals', color: '#F59E0B', bg: '#FFFBEB', path: '/admin/approvals' },
    { icon: Phone, label: 'Call Logs', color: '#10B981', bg: '#ECFDF5', path: '/admin/call-logs' },
    { icon: BarChart2, label: 'Reports', color: '#8B5CF6', bg: '#F5F3FF', path: '/admin/reports' },
    { icon: Trophy, label: 'Leaderboard', color: '#F59E0B', bg: '#FFFBEB', path: '/admin/leaderboard' },
    { icon: Settings, label: 'Settings', color: '#64748B', bg: '#F8FAFC', path: '/admin/settings' },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, usersRes, pendingRes] = await Promise.allSettled([
                    api.getAdminStats(),
                    api.getAdminRecentUsers(),
                    api.getPendingApprovals(),
                ]);
                if (statsRes.status === 'fulfilled') setStats(statsRes.value);
                if (usersRes.status === 'fulfilled') setRecentUsers(usersRes.value.users || []);
                if (pendingRes.status === 'fulfilled') setPendingCount(pendingRes.value.count || 0);
            } catch (e) { console.log(e); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    if (loading) return <LoadingPage />;

    const roleCounts = stats?.roleCounts || {};
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-400 font-medium">{today}</p>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">System Overview</h2>
                </div>
                {pendingCount > 0 && (
                    <button
                        onClick={() => navigate('/admin/approvals')}
                        className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors animate-fade-in"
                    >
                        <Clock size={15} className="text-amber-500" />
                        {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>

            {/* Stat Cards */}
            <div>
                <SectionHeader title="Overview" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Users"
                        value={stats?.totalUsers ?? 0}
                        icon={Users}
                        color="#3B82F6"
                        bgColor="#EFF6FF"
                        sub="All accounts"
                    />
                    <StatCard
                        label="Active Users"
                        value={stats?.activeUsers ?? 0}
                        icon={UserCheck}
                        color="#10B981"
                        bgColor="#ECFDF5"
                        sub="Enabled accounts"
                    />
                    <StatCard
                        label="New This Week"
                        value={stats?.newUsersThisWeek ?? 0}
                        icon={UserPlus}
                        color="#8B5CF6"
                        bgColor="#F5F3FF"
                        sub="Last 7 days"
                    />
                    <StatCard
                        label="Active Today"
                        value={stats?.recentlyActive ?? 0}
                        icon={Activity}
                        color="#F59E0B"
                        bgColor="#FFFBEB"
                        sub="Last 24 hours"
                    />
                </div>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <button
                    onClick={() => navigate('/admin/approvals')}
                    className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition-colors text-left animate-fade-in"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <ClipboardCheck size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-900 text-sm">
                                {pendingCount} Pending Approval{pendingCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-amber-600 text-xs mt-0.5">Click to review and approve accounts</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-amber-400" />
                </button>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Role Breakdown */}
                <Card>
                    <SectionHeader title="Users by Role" />
                    <div className="space-y-3">
                        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                            const count = roleCounts[key] || 0;
                            if (!count) return null;
                            const pct = stats?.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                                        <ShieldCheck size={14} style={{ color: cfg.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{cfg.label}</span>
                                            <span className="text-sm font-bold text-slate-900">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Recent Users */}
                <Card padding={false}>
                    <div className="p-5 border-b border-slate-50">
                        <SectionHeader
                            title="Recent Users"
                            action={
                                <Button variant="ghost" size="xs" onClick={() => navigate('/admin/users')} icon={ChevronRight}>
                                    View all
                                </Button>
                            }
                        />
                    </div>
                    {recentUsers.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-10">No users found</p>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {recentUsers.slice(0, 5).map((u) => {
                                const rc = ROLE_CONFIG[u.role] || ROLE_CONFIG.salesperson;
                                return (
                                    <div key={u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                                        <Avatar name={u.name} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                        </div>
                                        <Badge variant={u.role === 'super_admin' ? 'purple' : u.role === 'business_user' ? 'green' : 'blue'}>
                                            {rc.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <SectionHeader title="Quick Actions" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
    );
}