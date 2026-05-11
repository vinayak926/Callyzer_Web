// import React, { useContext, useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// const MENUS = {
//     super_admin: [
//         { path: '/admin/dashboard',   label: 'Dashboard',   icon: '🏠' },
//         { path: '/admin/approvals',   label: 'Approvals',   icon: '⏳' },
//         { path: '/admin/users',       label: 'Users',       icon: '👥' },
//         { path: '/admin/call-logs',   label: 'Call Logs',   icon: '📞' },
//         { path: '/admin/reports',     label: 'Reports',     icon: '📊' },
//         { path: '/admin/leaderboard', label: 'Leaderboard', icon: '🏆' },
//         { path: '/admin/settings',    label: 'Settings',    icon: '⚙️' },
//     ],
//     business_user: [
//         { path: '/business/dashboard',  label: 'Dashboard',   icon: '🏠' },
//         { path: '/business/live-feed',  label: 'Live Feed',   icon: '🔴' },
//         { path: '/business/team',       label: 'My Team',     icon: '👥' },
//         { path: '/business/call-logs',  label: 'Call Logs',   icon: '📞' },
//         { path: '/business/sync',       label: 'Sync Calls',  icon: '📲' },
//         { path: '/business/reports',    label: 'Reports',     icon: '📊' },
//         { path: '/business/leaderboard',label: 'Leaderboard', icon: '🏆' },
//     ],
//     salesperson: [
//         { path: '/salesperson/dashboard',  label: 'Dashboard',   icon: '🏠' },
//         { path: '/salesperson/call-logs',  label: 'Call Logs',   icon: '📞' },
//         { path: '/salesperson/history',    label: 'My History',  icon: '🕑' },
//         { path: '/salesperson/sync',       label: 'Sync Calls',  icon: '📲' },
//         { path: '/salesperson/reports',    label: 'Reports',     icon: '📊' },
//         { path: '/salesperson/leaderboard',label: 'Leaderboard', icon: '🏆' },
//     ],
// };

// const ROLE_COLORS = {
//     super_admin:   { color: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', label: 'Super Admin' },
//     business_user: { color: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', label: 'Business User' },
//     salesperson:   { color: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', label: 'Salesperson' },
// };

// export default function Layout() {
//     const { user, logout } = useContext(AuthContext);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const menuItems = MENUS[user?.role] || [];
//     const roleConfig = ROLE_COLORS[user?.role] || ROLE_COLORS.salesperson;

//     const handleNav = (path) => {
//         navigate(path);
//         setSidebarOpen(false);
//     };

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const currentLabel = menuItems.find(m => location.pathname === m.path)?.label || 'Callyzer';

//     return (
//         <div className="flex h-screen bg-gray-50 overflow-hidden">
//             {/* Mobile overlay */}
//             {sidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//                     onClick={() => setSidebarOpen(false)}
//                 />
//             )}

//             {/* Sidebar */}
//             <aside className={`
//                 fixed top-0 left-0 bottom-0 w-64 bg-slate-900 z-30 flex flex-col
//                 transform transition-transform duration-300 ease-in-out
//                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//                 lg:translate-x-0 lg:static lg:z-auto
//             `}>
//                 {/* Brand */}
//                 <div className={`p-5 border-b border-slate-700`}>
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">
//                             📞
//                         </div>
//                         <div>
//                             <p className="text-white font-bold text-lg leading-none">Callyzer</p>
//                             <p className="text-slate-400 text-xs mt-0.5">Call Management</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* User info */}
//                 <div className="p-4 border-b border-slate-700">
//                     <div className="flex items-center gap-3">
//                         <div className={`w-10 h-10 rounded-full ${roleConfig.color} flex items-center justify-center text-white font-bold text-base`}>
//                             {(user?.name || 'U').charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
//                             <p className="text-slate-400 text-xs truncate">{user?.email}</p>
//                         </div>
//                     </div>
//                     <div className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig.light} ${roleConfig.text}`}>
//                         {roleConfig.label}
//                     </div>
//                 </div>

//                 {/* Nav */}
//                 <nav className="flex-1 p-3 overflow-y-auto">
//                     {menuItems.map((item) => {
//                         const isActive = location.pathname === item.path;
//                         return (
//                             <button
//                                 key={item.path}
//                                 onClick={() => handleNav(item.path)}
//                                 className={`
//                                     w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
//                                     text-left transition-all duration-150 text-sm font-medium
//                                     ${isActive
//                                         ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
//                                         : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                                     }
//                                 `}
//                             >
//                                 <span className="text-base w-6 text-center">{item.icon}</span>
//                                 <span>{item.label}</span>
//                             </button>
//                         );
//                     })}
//                 </nav>

//                 {/* Logout */}
//                 <div className="p-3 border-t border-slate-700">
//                     <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
//                     >
//                         <span className="text-base">🚪</span>
//                         <span>Logout</span>
//                     </button>
//                 </div>
//             </aside>

//             {/* Main area */}
//             <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//                 {/* Top header */}
//                 <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 shrink-0 shadow-sm">
//                     <button
//                         onClick={() => setSidebarOpen(true)}
//                         className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                     <h1 className="text-gray-800 font-semibold text-base">{currentLabel}</h1>
//                     <div className="ml-auto flex items-center gap-3">
//                         <span className="text-gray-400 text-sm hidden sm:block">
//                             {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
//                         </span>
//                         <div className={`w-8 h-8 rounded-full ${roleConfig.color} flex items-center justify-center text-white font-bold text-sm`}>
//                             {(user?.name || 'U').charAt(0).toUpperCase()}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Page content */}
//                 <main className="flex-1 overflow-y-auto">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }


// import React, { useContext, useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// const MENUS = {
//     super_admin: [
//         { path: '/admin/dashboard',   label: 'Dashboard',   icon: '🏠' },
//         { path: '/admin/approvals',   label: 'Approvals',   icon: '⏳' },
//         { path: '/admin/users',       label: 'Users',       icon: '👥' },
//         { path: '/admin/call-logs',   label: 'Call Logs',   icon: '📞' },
//         { path: '/admin/reports',     label: 'Reports',     icon: '📊' },
//         { path: '/admin/leaderboard', label: 'Leaderboard', icon: '🏆' },
//         { path: '/admin/settings',    label: 'Settings',    icon: '⚙️' },
//     ],
//     business_user: [
//         { path: '/business/dashboard',  label: 'Dashboard',   icon: '🏠' },
//         { path: '/business/live-feed',  label: 'Live Feed',   icon: '🔴' },
//         { path: '/business/team',       label: 'My Team',     icon: '👥' },
//         { path: '/business/leads',        label: 'Leads',        icon: '🎯' },
//         { path: '/business/worked-leads', label: 'Salesperson Activity', icon: '👥'},
//         { path: '/business/call-logs',  label: 'Call Logs',   icon: '📞' },
//         { path: '/business/sync',       label: 'Sync Calls',  icon: '📲' },
//         { path: '/business/reports',    label: 'Reports',     icon: '📊' },
//         { path: '/business/leaderboard',label: 'Leaderboard', icon: '🏆' },
//         { path: '/business/subscription', label: 'Subscription', icon: '💳' },
//     ],
//     salesperson: [
//         { path: '/salesperson/dashboard',  label: 'Dashboard',   icon: '🏠' },
//         { path: '/salesperson/leads',       label: 'My Leads',    icon: '🎯' }, 
//         { path: '/salesperson/call-logs',  label: 'Call Logs',   icon: '📞' },
//         { path: '/salesperson/history',    label: 'My History',  icon: '🕑' },
//         { path: '/salesperson/sync',       label: 'Sync Calls',  icon: '📲' },
//         { path: '/salesperson/reports',    label: 'Reports',     icon: '📊' },
//         { path: '/salesperson/leaderboard',label: 'Leaderboard', icon: '🏆' },
//     ],
// };

// const ROLE_COLORS = {
//     super_admin:   { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', label: 'Super Admin' },
//     business_user: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', label: 'Business User' },
//     salesperson:   { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', label: 'Salesperson' },
// };

// export default function Layout() {
//     const { user, logout } = useContext(AuthContext);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const menuItems = MENUS[user?.role] || [];
//     const roleConfig = ROLE_COLORS[user?.role] || ROLE_COLORS.salesperson;

//     const handleNav = (path) => {
//         navigate(path);
//         setSidebarOpen(false);
//     };

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const currentLabel = menuItems.find(m => location.pathname === m.path)?.label || 'Callyzer';

//     return (
//         <div className="flex h-screen bg-gray-50 overflow-hidden">
//             {/* Mobile overlay */}
//             {sidebarOpen && (
//                 <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
//             )}

//             {/* Sidebar - Fixed width with proper spacing */}
//             <aside className={`
//                 fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-30 flex flex-col shadow-2xl
//                 transform transition-transform duration-300 ease-in-out
//                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//                 lg:translate-x-0 lg:static lg:z-auto
//             `}>
//                 {/* Brand Section */}
//                 <div className="px-5 py-6 border-b border-slate-700/50">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                             <span className="text-xl">📞</span>
//                         </div>
//                         <div>
//                             <p className="text-white font-bold text-lg leading-tight">Callyzer</p>
//                             <p className="text-slate-400 text-xs">Call Management</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* User Info Section */}
//                 <div className="px-5 py-4 border-b border-slate-700/50">
//                     <div className="flex items-center gap-3">
//                         <div className={`w-11 h-11 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-base shadow-lg shrink-0`}>
//                             {(user?.name || 'U').charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <p className="text-white font-semibold text-sm truncate">{user?.name || 'User'}</p>
//                             <p className="text-slate-400 text-xs truncate">{user?.email || 'user@example.com'}</p>
//                         </div>
//                     </div>
//                     <div className="mt-3 inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
//                         {roleConfig.label}
//                     </div>
//                 </div>

//                 {/* Navigation Menu */}
//                 <nav className="flex-1 overflow-y-auto px-3 py-4">
//                     <div className="space-y-1">
//                         {menuItems.map((item) => {
//                             const isActive = location.pathname === item.path;
//                             return (
//                                 <button
//                                     key={item.path}
//                                     onClick={() => handleNav(item.path)}
//                                     className={`
//                                         w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
//                                         transition-all duration-200 text-left
//                                         ${isActive 
//                                             ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' 
//                                             : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                                         }
//                                     `}
//                                 >
//                                     <span className="text-xl w-7 text-center shrink-0">{item.icon}</span>
//                                     <span className="text-sm font-medium truncate">{item.label}</span>
//                                     {isActive && (
//                                         <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></span>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </nav>

//                 {/* Logout Button */}
//                 <div className="p-4 border-t border-slate-700/50">
//                     <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
//                     >
//                         <span className="text-xl w-7 text-center shrink-0">🚪</span>
//                         <span className="truncate">Logout</span>
//                     </button>
//                 </div>
//             </aside>

//             {/* Main Content Area */}
//             <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//                 {/* Top Header - Mobile Menu Button */}
//                 <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 shrink-0 shadow-sm">
//                     <button
//                         onClick={() => setSidebarOpen(true)}
//                         className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                     <h1 className="text-gray-800 font-semibold text-base truncate">{currentLabel}</h1>
//                     <div className="ml-auto flex items-center gap-3">
//                         <span className="text-gray-400 text-sm hidden sm:block">
//                             {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
//                         </span>
//                         <div className={`w-8 h-8 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
//                             {(user?.name || 'U').charAt(0).toUpperCase()}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Page Content */}
//                 <main className="flex-1 overflow-y-auto bg-gray-50">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }

import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, ClipboardCheck, Phone, BarChart2,
    Trophy, Settings, Radio, UserSquare, History,
    Smartphone, LogOut, X, PhoneCall, Target, CreditCard,
} from 'lucide-react';

const MENUS = {
    super_admin: [
        { path: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        { path: '/admin/approvals',   label: 'Approvals',   icon: ClipboardCheck },
        { path: '/admin/users',       label: 'Users',       icon: Users },
        { path: '/admin/call-logs',   label: 'Call Logs',   icon: Phone },
        { path: '/admin/reports',     label: 'Reports',     icon: BarChart2 },
        { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
        { path: '/admin/settings',    label: 'Settings',    icon: Settings },
    ],
    business_user: [
        { path: '/business/dashboard',    label: 'Dashboard',             icon: LayoutDashboard },
        { path: '/business/live-feed',    label: 'Live Feed',             icon: Radio },
        { path: '/business/team',         label: 'My Team',               icon: UserSquare },
        { path: '/business/leads',        label: 'Leads',                 icon: Target },
        { path: '/business/worked-leads', label: 'Salesperson Activity',  icon: Users },
        { path: '/business/call-logs',    label: 'Call Logs',             icon: Phone },
        { path: '/business/sync',         label: 'Sync Calls',            icon: Smartphone },
        { path: '/business/reports',      label: 'Reports',               icon: BarChart2 },
        { path: '/business/leaderboard',  label: 'Leaderboard',           icon: Trophy },
        { path: '/business/subscription', label: 'Subscription',          icon: CreditCard },
    ],
    salesperson: [
        { path: '/salesperson/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        { path: '/salesperson/leads',       label: 'My Leads',    icon: Target },
        { path: '/salesperson/call-logs',   label: 'Call Logs',   icon: Phone },
        { path: '/salesperson/history',     label: 'My History',  icon: History },
        { path: '/salesperson/sync',        label: 'Sync Calls',  icon: Smartphone },
        { path: '/salesperson/reports',     label: 'Reports',     icon: BarChart2 },
        { path: '/salesperson/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
};

// Light theme palette (matches base UI)
const S = {
    bg:           '#F0F4F8',
    border:       '#CBD5E1',
    activeBtn:    '#3B82F6',
    activeShadow: '0 4px 14px 0 rgba(59,130,246,0.39)',
    activeText:   '#FFFFFF',
    hoverBtn:     '#E2E8F0',
    inactiveText: '#64748B',
    inactiveIcon: '#94A3B8',
    labelText:    '#94A3B8',
    headingText:  '#1E293B',
    subText:      '#94A3B8',
};

const ROLE_CONFIG = {
    super_admin:   { label: 'Super Admin',  dot: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', text: '#7C3AED' },
    business_user: { label: 'Team Lead',    dot: '#0891B2', bg: 'rgba(6,182,212,0.12)',  text: '#0891B2' },
    salesperson:   { label: 'Salesperson',  dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)', text: '#2563EB' },
};

const AV_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4'];

function SidebarAvatar({ name = '' }) {
    const bg = AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];
    return (
        <div
            style={{ width: 36, height: 36, borderRadius: 999, background: bg, flexShrink: 0 }}
            className="flex items-center justify-center text-white font-bold text-sm"
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px 9px 10px', borderRadius: 10,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                marginBottom: 2, position: 'relative',
                transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out',
                background: isActive ? S.activeBtn : hovered ? S.hoverBtn : 'transparent',
                color:      isActive ? S.activeText : S.inactiveText,
                boxShadow:  isActive ? S.activeShadow : 'none',
            }}
        >
            {isActive && (
                <span style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: 20, borderRadius: '0 3px 3px 0',
                    background: '#FFFFFF', opacity: 0.8,
                }} />
            )}
            <Icon
                size={17}
                style={{
                    flexShrink: 0,
                    color: isActive ? '#FFFFFF' : hovered ? '#3B82F6' : S.inactiveIcon,
                    transition: 'color 0.2s ease-in-out',
                }}
            />
            <span style={{ flex: 1 }}>{label}</span>
            {isActive && (
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
            )}
        </button>
    );
}

function LogoutBtn({ onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 500, textAlign: 'left',
                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
                background: hovered ? 'rgba(239,68,68,0.08)' : 'transparent',
                color:      hovered ? '#EF4444' : S.inactiveText,
            }}
        >
            <LogOut size={17} style={{ flexShrink: 0, color: hovered ? '#EF4444' : S.inactiveIcon, transition: 'color 0.2s ease-in-out' }} />
            <span>Sign Out</span>
        </button>
    );
}

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems  = MENUS[user?.role] || [];
    const roleConf   = ROLE_CONFIG[user?.role] || ROLE_CONFIG.salesperson;

    const go       = (path) => { navigate(path); setSidebarOpen(false); };
    const doLogout = ()     => { logout(); navigate('/login'); };

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{ width: 260, background: S.bg, borderRight: `1px solid ${S.border}` }}
                className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Brand */}
                <div
                    style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${S.border}` }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div style={{
                            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                            boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <PhoneCall size={17} color="#fff" />
                        </div>
                        <div>
                            <p style={{ color: S.headingText, fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Callyzer</p>
                            <p style={{ color: S.subText, fontSize: 11, marginTop: 3 }}>Call Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                        style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: S.inactiveText }}
                        onMouseEnter={e => { e.currentTarget.style.background = S.hoverBtn; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* User profile */}
                <div style={{ padding: '14px 16px', borderBottom: `1px solid ${S.border}` }}>
                    <div className="flex items-center gap-3">
                        <SidebarAvatar name={user?.name || 'U'} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: S.headingText, fontWeight: 600, fontSize: 13.5, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'User'}
                            </p>
                            <p style={{ color: S.subText, fontSize: 11, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 999,
                            background: roleConf.bg, color: roleConf.text,
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: roleConf.dot, flexShrink: 0 }} />
                            {roleConf.label}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                    <p style={{
                        color: S.labelText, fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        padding: '0 10px', marginBottom: 6,
                    }}>Navigation</p>

                    {menuItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.path}
                            onClick={() => go(item.path)}
                        />
                    ))}
                </nav>

                {/* Sign Out */}
                <div style={{ padding: '10px 10px 16px', borderTop: `1px solid ${S.border}` }}>
                    <LogoutBtn onClick={doLogout} />
                    <p style={{ color: S.subText, fontSize: 10, textAlign: 'center', marginTop: 10 }}>
                        Callyzer v2.0 · 2024
                    </p>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

// ── Header (inline) ──────────────────────────────────────
import { Menu, Bell, ChevronDown, User } from 'lucide-react';

const PAGE_TITLES = {
    '/admin/dashboard':        { title: 'Dashboard',            subtitle: 'System overview & analytics' },
    '/admin/users':            { title: 'Manage Users',         subtitle: 'Create, edit and manage accounts' },
    '/admin/approvals':        { title: 'Pending Approvals',    subtitle: 'Review and approve new accounts' },
    '/admin/settings':         { title: 'System Settings',      subtitle: 'Configure your workspace' },
    '/admin/call-logs':        { title: 'Call Logs',            subtitle: 'All system call records' },
    '/admin/reports':          { title: 'Reports & Analytics',  subtitle: 'Deep dive into performance data' },
    '/admin/leaderboard':      { title: 'Leaderboard',          subtitle: 'Top performing agents' },
    '/business/dashboard':     { title: 'Dashboard',            subtitle: "Your team's performance" },
    '/business/team':          { title: 'My Team',              subtitle: 'Manage your salespersons' },
    '/business/live-feed':     { title: 'Live Feed',            subtitle: 'Real-time call activity' },
    '/business/leads':         { title: 'Leads Management',     subtitle: 'Manage and track all your sales leads' },
    '/business/worked-leads':  { title: 'Salesperson Activity', subtitle: 'Track what your team is working on' },
    '/business/call-logs':     { title: 'Call Logs',            subtitle: 'Team call records' },
    '/business/reports':       { title: 'Reports',              subtitle: 'Team performance analytics' },
    '/business/leaderboard':   { title: 'Leaderboard',          subtitle: 'Top performers in your team' },
    '/business/sync':          { title: 'Device Sync',          subtitle: 'Sync calls from mobile' },
    '/business/subscription':  { title: 'Subscription',         subtitle: 'Manage your plan & billing' },
    '/salesperson/dashboard':  { title: 'My Dashboard',         subtitle: 'Your personal overview' },
    '/salesperson/leads':      { title: 'My Leads',             subtitle: 'View leads, call and add follow-ups' },
    '/salesperson/call-logs':  { title: 'Call Logs',            subtitle: 'Your call records' },
    '/salesperson/history':    { title: 'Call History',         subtitle: 'Complete call history' },
    '/salesperson/sync':       { title: 'Sync Calls',           subtitle: 'Sync from your device' },
    '/salesperson/reports':    { title: 'Reports',              subtitle: 'Your performance data' },
    '/salesperson/leaderboard':{ title: 'Leaderboard',          subtitle: 'Team rankings' },
};

function Header({ onMenuClick }) {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const page = PAGE_TITLES[location.pathname] || { title: 'Callyzer', subtitle: '' };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-100 h-16 flex items-center px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center justify-between w-full gap-4">
                {/* Left: Menu + Title */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base font-bold text-slate-900 leading-none truncate">{page.title}</h1>
                        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block truncate">{page.subtitle}</p>
                    </div>
                </div>

                {/* Right: Actions + Profile */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(v => !v)}
                            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <SidebarAvatar name={user?.name || 'U'} />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</p>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-scale-in">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-1.5">
                                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                            <User size={15} className="text-slate-400" />
                                            My Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                        >
                                            <LogOut size={15} className="text-rose-400" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}