// ============================================
// LAYOUT / SIDEBAR — Premium Redesign (Light + Dark)
// ============================================
// CHANGES (UI only):
//   • Sidebar: always-dark premium look (bg-sidebar)
//   • Active nav: gradient highlight from-primary/15 + left accent bar
//   • Role colors: role-admin, role-business, role-sales
//   • Top header: bg-card / dark:bg-card-dark with border-line
//   • Main area: bg-page / dark:bg-page-dark
//   • NEW: Dark/Light mode toggle button in sidebar footer
//   • dark: variant on header and main content area
//   • Hover micro-animations on all interactive elements
// UNCHANGED: All MENUS, ROLE_COLORS logic, state, navigation, Outlet
// ============================================

import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MENUS = {
    super_admin: [
        { path: '/admin/dashboard',   label: 'Dashboard',   icon: '🏠' },
        { path: '/admin/approvals',   label: 'Approvals',   icon: '⏳' },
        { path: '/admin/users',       label: 'Users',       icon: '👥' },
        { path: '/admin/call-logs',   label: 'Call Logs',   icon: '📞' },
        { path: '/admin/reports',     label: 'Reports',     icon: '📊' },
        { path: '/admin/leaderboard', label: 'Leaderboard', icon: '🏆' },
        { path: '/admin/settings',    label: 'Settings',    icon: '⚙️' },
    ],
    business_user: [
        { path: '/business/dashboard',  label: 'Dashboard',   icon: '🏠' },
        { path: '/business/live-feed',  label: 'Live Feed',   icon: '🔴' },
        { path: '/business/team',       label: 'My Team',     icon: '👥' },
        { path: '/business/call-logs',  label: 'Call Logs',   icon: '📞' },
        { path: '/business/sync',       label: 'Sync Calls',  icon: '📲' },
        { path: '/business/reports',    label: 'Reports',     icon: '📊' },
        { path: '/business/leaderboard',label: 'Leaderboard', icon: '🏆' },
        { path: '/business/subscription', label: 'Subscription', icon: '💳' },
    ],
    salesperson: [
        { path: '/salesperson/dashboard',  label: 'Dashboard',   icon: '🏠' },
        { path: '/salesperson/call-logs',  label: 'Call Logs',   icon: '📞' },
        { path: '/salesperson/history',    label: 'My History',  icon: '🕑' },
        { path: '/salesperson/sync',       label: 'Sync Calls',  icon: '📲' },
        { path: '/salesperson/reports',    label: 'Reports',     icon: '📊' },
        { path: '/salesperson/leaderboard',label: 'Leaderboard', icon: '🏆' },
    ],
};

const ROLE_COLORS = {
    super_admin:   { bg: 'bg-role-admin',   text: 'text-role-admin',   soft: 'bg-role-admin-soft',   label: 'Super Admin' },
    business_user: { bg: 'bg-role-business', text: 'text-role-business', soft: 'bg-role-business-soft', label: 'Business User' },
    salesperson:   { bg: 'bg-role-sales',    text: 'text-role-sales',    soft: 'bg-role-sales-soft',    label: 'Salesperson' },
};

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // ── Dark mode toggle (stored in localStorage) ──
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('callyzer-theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('callyzer-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('callyzer-theme', 'light');
        }
    }, [darkMode]);

    const menuItems = MENUS[user?.role] || [];
    const roleConfig = ROLE_COLORS[user?.role] || ROLE_COLORS.salesperson;

    const handleNav = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentLabel = menuItems.find(m => location.pathname === m.path)?.label || 'Callyzer';

    return (
        <div className="flex h-screen bg-page dark:bg-page-dark overflow-hidden transition-colors duration-300">

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Sidebar (always dark for premium look) ── */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-72 bg-sidebar z-30 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>

                {/* Brand */}
                <div className="px-5 py-5 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow">
                            <span className="text-xl">📞</span>
                        </div>
                        <div>
                            <p className="text-sidebar-heading font-bold text-lg leading-tight tracking-tight">Callyzer</p>
                            <p className="text-sidebar-text text-xs">Call Management</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-5 py-4 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}>
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sidebar-heading font-semibold text-sm truncate">{user?.name || 'User'}</p>
                            <p className="text-sidebar-text text-xs truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <div className={`mt-2.5 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig.soft} ${roleConfig.text}`}>
                        {roleConfig.label}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNav(item.path)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 text-left cursor-pointer relative
                                        ${isActive
                                            ? 'bg-sidebar-active text-sidebar-heading shadow-glow'
                                            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-heading'
                                        }
                                    `}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                                    )}
                                    <span className="text-lg w-7 text-center shrink-0">{item.icon}</span>
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer: Theme toggle + Logout */}
                <div className="p-3 border-t border-sidebar-border space-y-1">

                    {/* Dark/Light toggle */}
                    <button
                        onClick={() => setDarkMode(prev => !prev)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-heading transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-lg w-7 text-center shrink-0">{darkMode ? '☀️' : '🌙'}</span>
                        <span className="truncate">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        {/* Toggle pill */}
                        <div className={`ml-auto w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-sidebar-hover'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 hover:text-danger transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-lg w-7 text-center shrink-0">🚪</span>
                        <span className="truncate">Logout</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Header */}
                <header className="bg-card dark:bg-card-dark/80 dark:backdrop-blur-xl border-b border-line dark:border-line-dark px-4 lg:px-6 py-3.5 flex items-center gap-4 shrink-0 shadow-card dark:shadow-none transition-colors duration-300">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-hover-bg dark:hover:bg-hover-bg-dark text-body dark:text-body-dark transition-colors duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-heading dark:text-heading-dark font-semibold text-base truncate tracking-tight">{currentLabel}</h1>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-subtle dark:text-subtle-dark text-sm hidden sm:block">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className={`w-8 h-8 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-sm shadow-card shrink-0`}>
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-page dark:bg-page-dark transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}