// import { useNavigate, useLocation } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

// const pageTitles = {
//     '/admin/dashboard':        { title: 'Super Admin Overview',    subtitle: 'Manage your entire system' },
//     '/admin/users':            { title: 'Manage Users',            subtitle: 'Create, edit and manage accounts' },
//     '/admin/approvals':        { title: 'Pending Approvals',       subtitle: 'Review and approve new accounts' },
//     '/admin/settings':         { title: 'Settings',                subtitle: 'System configuration' },
//     '/business/dashboard':     { title: 'Business Dashboard',      subtitle: "Your team's performance overview" },
//     '/business/my-team':       { title: 'My Team',                 subtitle: 'Manage your salespersons' },
//     '/business/leads':          { title: 'Leads Management',   subtitle: 'Manage and track all your sales leads' },
//     '/salesperson/leads':       { title: 'My Leads',           subtitle: 'View leads, call and add follow-ups' },
//     '/salesperson/dashboard':  { title: 'My Dashboard',            subtitle: 'Your personal call overview' },
//     '/call-logs':              { title: 'Call Logs',               subtitle: 'View all your call records' },
//     '/reports':                { title: 'Reports & Analytics',     subtitle: 'Analyze your performance' },
//     '/leaderboard':            { title: 'Leaderboard',             subtitle: 'Top performing salespersons' },
//     '/live-feed':              { title: 'Live Feed',               subtitle: 'Real-time call activity' },
//     '/call-history':           { title: 'Call History',            subtitle: 'Your complete call history' },
//     '/device-sync':            { title: 'Device Call Sync',        subtitle: 'Sync calls from your device' },
// };

// const Header = ({ onMenuClick }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, logout } = useContext(AuthContext);

//     const currentPage = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: "Here's your overview" };

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     {/* Mobile menu button */}
//                     <button
//                         onClick={onMenuClick}
//                         className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                     <div>
//                         <h1 className="text-lg font-bold text-gray-900 leading-tight">{currentPage.title}</h1>
//                         <p className="text-xs text-gray-500 hidden sm:block">{currentPage.subtitle}</p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     {/* User info */}
//                     <div className="hidden sm:flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <span className="text-indigo-600 font-bold text-sm">
//                                 {(user?.name || 'U').charAt(0).toUpperCase()}
//                             </span>
//                         </div>
//                         <div className="hidden md:block">
//                             <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'User'}</p>
//                             <p className="text-xs text-gray-500 mt-0.5">{user?.email || ''}</p>
//                         </div>
//                     </div>

//                     {/* Logout */}
//                     <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
//                     >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                         </svg>
//                         <span className="hidden sm:inline">Sign out</span>
//                     </button>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;

import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react';

const AV_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4'];

function Avatar({ name = '' }) {
    const bg = AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length];
    return (
        <div
            style={{ width: 32, height: 32, borderRadius: 999, background: bg, flexShrink: 0 }}
            className="flex items-center justify-center text-white font-bold text-sm"
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

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

export default function Header({ onMenuClick }) {
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

                {/* Left: Hamburger + Page Title */}
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

                {/* Right: Bell + Profile */}
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
                            <Avatar name={user?.name || 'U'} />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                                    {user?.role?.replace(/_/g, ' ')}
                                </p>
                            </div>
                            <ChevronDown
                                size={14}
                                className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                                {/* Dropdown */}
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