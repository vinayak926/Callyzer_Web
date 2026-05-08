import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, ClipboardCheck, Phone, BarChart2,
    Trophy, Settings, Radio, UserSquare, History,
    Smartphone, ShieldCheck, LogOut, X, PhoneCall,
} from 'lucide-react';
import { Avatar, Badge } from '../UI';

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

const ROLE_CONFIG = {
    super_admin: { label: 'Super Admin', variant: 'purple' },
    business_user: { label: 'Team Lead', variant: 'cyan' },
    salesperson: { label: 'Salesperson', variant: 'blue' },
};

export default function Sidebar({ open, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = MENUS[user?.role] || [];
    const roleConf = ROLE_CONFIG[user?.role] || { label: 'User', variant: 'default' };

    const handleNav = (path) => {
        navigate(path);
        onClose?.();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 bottom-0 z-50 flex flex-col
          w-[260px] bg-[#0F172A] transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Brand */}
                <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-900/40">
                                <PhoneCall size={17} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-base leading-none tracking-tight">Callyzer</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">Call Intelligence</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* User Profile */}
                <div className="px-4 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <Avatar name={user?.name || 'U'} size="md" />
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm leading-none truncate">{user?.name}</p>
                            <p className="text-slate-500 text-[11px] mt-1 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <Badge variant={roleConf.variant} dot>{roleConf.label}</Badge>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 text-left group
                  ${isActive
                                        ? 'nav-active text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                    }
                `}
                            >
                                <Icon
                                    size={17}
                                    className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}
                                />
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-white/[0.06]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 group"
                    >
                        <LogOut size={17} className="shrink-0 group-hover:scale-105 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                    <p className="text-[10px] text-slate-700 text-center mt-3">Callyzer v2.0 · 2024</p>
                </div>
            </aside>
        </>
    );
}