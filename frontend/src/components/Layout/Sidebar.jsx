// import React, { useContext } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import {
//     LayoutDashboard, Users, ClipboardCheck, Phone, BarChart2,
//     Trophy, Settings, Radio, UserSquare, History,
//     Smartphone, ShieldCheck, LogOut, X, PhoneCall,
// } from 'lucide-react';
// import { Avatar, Badge } from '../UI';

// const MENUS = {
//     super_admin: [
//         { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//         { path: '/admin/approvals', label: 'Approvals', icon: ClipboardCheck },
//         { path: '/admin/users', label: 'Users', icon: Users },
//         { path: '/admin/call-logs', label: 'Call Logs', icon: Phone },
//         { path: '/admin/reports', label: 'Reports', icon: BarChart2 },
//         { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
//         { path: '/admin/settings', label: 'Settings', icon: Settings },
//     ],
//     business_user: [
//         { path: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//         { path: '/business/live-feed', label: 'Live Feed', icon: Radio },
//         { path: '/business/team', label: 'My Team', icon: UserSquare },
//         { path: '/business/call-logs', label: 'Call Logs', icon: Phone },
//         { path: '/business/sync', label: 'Sync Calls', icon: Smartphone },
//         { path: '/business/reports', label: 'Reports', icon: BarChart2 },
//         { path: '/business/leaderboard', label: 'Leaderboard', icon: Trophy },
//     ],
//     salesperson: [
//         { path: '/salesperson/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//         { path: '/salesperson/call-logs', label: 'Call Logs', icon: Phone },
//         { path: '/salesperson/history', label: 'My History', icon: History },
//         { path: '/salesperson/sync', label: 'Sync Calls', icon: Smartphone },
//         { path: '/salesperson/reports', label: 'Reports', icon: BarChart2 },
//         { path: '/salesperson/leaderboard', label: 'Leaderboard', icon: Trophy },
//     ],
// };

// const ROLE_CONFIG = {
//     super_admin: { label: 'Super Admin', variant: 'purple' },
//     business_user: { label: 'Team Lead', variant: 'cyan' },
//     salesperson: { label: 'Salesperson', variant: 'blue' },
// };

// export default function Sidebar({ open, onClose }) {
//     const { user, logout } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const menuItems = MENUS[user?.role] || [];
//     const roleConf = ROLE_CONFIG[user?.role] || { label: 'User', variant: 'default' };

//     const handleNav = (path) => {
//         navigate(path);
//         onClose?.();
//     };

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <>
//             {/* Mobile overlay */}
//             {open && (
//                 <div
//                     className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
//                     onClick={onClose}
//                 />
//             )}

//             {/* Sidebar */}
//             <aside
//                 className={`
//           fixed top-0 left-0 bottom-0 z-50 flex flex-col
//           w-[260px] bg-[#0F172A] transition-transform duration-300 ease-in-out
//           lg:translate-x-0 lg:static lg:z-auto
//           ${open ? 'translate-x-0' : '-translate-x-full'}
//         `}
//             >
//                 {/* Brand */}
//                 <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-900/40">
//                                 <PhoneCall size={17} className="text-white" />
//                             </div>
//                             <div>
//                                 <p className="text-white font-bold text-base leading-none tracking-tight">Callyzer</p>
//                                 <p className="text-slate-500 text-[11px] mt-0.5">Call Intelligence</p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
//                         >
//                             <X size={15} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* User Profile */}
//                 <div className="px-4 py-4 border-b border-white/[0.06]">
//                     <div className="flex items-center gap-3">
//                         <Avatar name={user?.name || 'U'} size="md" />
//                         <div className="flex-1 min-w-0">
//                             <p className="text-white font-semibold text-sm leading-none truncate">{user?.name}</p>
//                             <p className="text-slate-500 text-[11px] mt-1 truncate">{user?.email}</p>
//                         </div>
//                     </div>
//                     <div className="mt-3">
//                         <Badge variant={roleConf.variant} dot>{roleConf.label}</Badge>
//                     </div>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
//                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
//                     {menuItems.map((item) => {
//                         const Icon = item.icon;
//                         const isActive = location.pathname === item.path;
//                         return (
//                             <button
//                                 key={item.path}
//                                 onClick={() => handleNav(item.path)}
//                                 className={`
//                   w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
//                   transition-all duration-150 text-left group
//                   ${isActive
//                                         ? 'nav-active text-white'
//                                         : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
//                                     }
//                 `}
//                             >
//                                 <Icon
//                                     size={17}
//                                     className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}
//                                 />
//                                 <span>{item.label}</span>
//                                 {isActive && (
//                                     <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </nav>

//                 {/* Logout */}
//                 <div className="px-3 py-4 border-t border-white/[0.06]">
//                     <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 group"
//                     >
//                         <LogOut size={17} className="shrink-0 group-hover:scale-105 transition-transform" />
//                         <span>Sign Out</span>
//                     </button>
//                     <p className="text-[10px] text-slate-700 text-center mt-3">Callyzer v2.0 · 2024</p>
//                 </div>
//             </aside>
//         </>
//     );
// }

import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, ClipboardCheck, Phone, BarChart2,
    Trophy, Settings, Radio, UserSquare, History,
    Smartphone, LogOut, X, PhoneCall,
} from 'lucide-react';

const MENUS = {
    super_admin: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/approvals', label: 'Approvals', icon: ClipboardCheck },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/call-logs', label: 'Call Logs', icon: Phone },
        { path: '/admin/reports', label: 'Reports', icon: BarChart2 },
        { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ],
    business_user: [
        { path: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/business/live-feed', label: 'Live Feed', icon: Radio },
        { path: '/business/team', label: 'My Team', icon: UserSquare },
        { path: '/business/call-logs', label: 'Call Logs', icon: Phone },
        { path: '/business/sync', label: 'Sync Calls', icon: Smartphone },
        { path: '/business/reports', label: 'Reports', icon: BarChart2 },
        { path: '/business/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
    salesperson: [
        { path: '/salesperson/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/salesperson/call-logs', label: 'Call Logs', icon: Phone },
        { path: '/salesperson/history', label: 'My History', icon: History },
        { path: '/salesperson/sync', label: 'Sync Calls', icon: Smartphone },
        { path: '/salesperson/reports', label: 'Reports', icon: BarChart2 },
        { path: '/salesperson/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
};

/* Role badge rendered inline — dark-sidebar–safe colours */
const ROLE_CONFIG = {
    super_admin: { label: 'Super Admin', dot: '#a78bfa', bg: 'rgba(139,92,246,0.18)', text: '#c4b5fd' },
    business_user: { label: 'Team Lead', dot: '#22d3ee', bg: 'rgba(6,182,212,0.18)', text: '#67e8f9' },
    salesperson: { label: 'Salesperson', dot: '#60a5fa', bg: 'rgba(59,130,246,0.18)', text: '#93c5fd' },
};

/* Avatar initials — same palette as main app */
const AV_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4'];
function SidebarAvatar({ name = '', size = 36 }) {
    const bg = AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];
    return (
        <div
            style={{ width: size, height: size, backgroundColor: bg, borderRadius: 999, flexShrink: 0 }}
            className="flex items-center justify-center text-white font-bold text-sm"
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function Sidebar({ open, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = MENUS[user?.role] || [];
    const roleConf = ROLE_CONFIG[user?.role] || ROLE_CONFIG.salesperson;

    const go = (path) => { navigate(path); onClose?.(); };
    const doLogout = () => { logout(); navigate('/login'); };

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
            )}

            {/* ── Sidebar shell ── */}
            <aside
                style={{ width: 260, background: '#0F172A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
                className={`
          fixed top-0 left-0 bottom-0 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* ── Brand ── */}
                <div
                    style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        {/* Logo icon */}
                        <div
                            style={{
                                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                                boxShadow: '0 4px 16px rgba(59,130,246,0.45)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <PhoneCall size={17} color="#fff" />
                        </div>
                        <div>
                            <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Callyzer</p>
                            <p style={{ color: '#475569', fontSize: 11, marginTop: 3 }}>Call Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden"
                        style={{ padding: 6, borderRadius: 8, color: '#64748B', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* ── User profile ── */}
                <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3">
                        <SidebarAvatar name={user?.name || 'U'} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 13.5, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </p>
                            <p style={{ color: '#475569', fontSize: 11, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>

                    {/* Role badge — rendered with inline styles so dark bg always works */}
                    <div style={{ marginTop: 10 }}>
                        <span
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '4px 10px', borderRadius: 999,
                                background: roleConf.bg,
                                color: roleConf.text,
                                fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
                            }}
                        >
                            <span
                                style={{ width: 6, height: 6, borderRadius: 999, background: roleConf.dot, flexShrink: 0 }}
                            />
                            {roleConf.label}
                        </span>
                    </div>
                </div>

                {/* ── Navigation ── */}
                <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
                    <p
                        style={{
                            color: '#334155', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            padding: '0 10px', marginBottom: 8,
                        }}
                    >
                        Navigation
                    </p>

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavItem
                                key={item.path}
                                icon={Icon}
                                label={item.label}
                                isActive={isActive}
                                onClick={() => go(item.path)}
                            />
                        );
                    })}
                </nav>

                {/* ── Sign Out ── */}
                <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <LogoutBtn onClick={doLogout} />
                    <p style={{ color: '#1E293B', fontSize: 10, textAlign: 'center', marginTop: 10 }}>
                        Callyzer v2.0 · 2024
                    </p>
                </div>
            </aside>
        </>
    );
}

/* ── Nav Item — inline hover via React state ── */
function NavItem({ icon: Icon, label, isActive, onClick }) {
    const [hovered, setHovered] = React.useState(false);

    const activeStyle = {
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        boxShadow: '0 4px 16px rgba(37,99,235,0.40)',
        color: '#FFFFFF',
    };
    const hoverStyle = {
        background: 'rgba(255,255,255,0.07)',
        color: '#CBD5E1',
    };
    const idleStyle = {
        background: 'transparent',
        color: '#64748B',
    };

    const style = isActive ? activeStyle : hovered ? hoverStyle : idleStyle;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: isActive ? 600 : 500, textAlign: 'left',
                transition: 'all 0.15s ease',
                marginBottom: 2,
                ...style,
            }}
        >
            <Icon
                size={17}
                style={{
                    flexShrink: 0,
                    color: isActive ? '#ffffff' : hovered ? '#94A3B8' : '#475569',
                    transition: 'color 0.15s ease',
                }}
            />
            <span style={{ flex: 1 }}>{label}</span>
            {isActive && (
                <span
                    style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: 'rgba(255,255,255,0.65)', flexShrink: 0,
                    }}
                />
            )}
        </button>
    );
}

/* ── Logout Button ── */
function LogoutBtn({ onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 500, textAlign: 'left',
                transition: 'all 0.15s ease',
                background: hovered ? 'rgba(244,63,94,0.12)' : 'transparent',
                color: hovered ? '#FB7185' : '#64748B',
            }}
        >
            <LogOut size={17} style={{ flexShrink: 0, color: hovered ? '#FB7185' : '#475569' }} />
            <span>Sign Out</span>
        </button>
    );
}