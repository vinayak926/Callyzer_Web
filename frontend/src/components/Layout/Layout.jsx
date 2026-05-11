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


import React, { useContext, useState } from 'react';
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
        { path: '/business/leads',        label: 'Leads',        icon: '🎯' },
        { path: '/business/worked-leads', label: 'Salesperson Activity', icon: '👥'},
        { path: '/business/call-logs',  label: 'Call Logs',   icon: '📞' },
        { path: '/business/sync',       label: 'Sync Calls',  icon: '📲' },
        { path: '/business/reports',    label: 'Reports',     icon: '📊' },
        { path: '/business/leaderboard',label: 'Leaderboard', icon: '🏆' },
        { path: '/business/subscription', label: 'Subscription', icon: '💳' },
    ],
    salesperson: [
        { path: '/salesperson/dashboard',  label: 'Dashboard',   icon: '🏠' },
        { path: '/salesperson/leads',       label: 'My Leads',    icon: '🎯' }, 
        { path: '/salesperson/call-logs',  label: 'Call Logs',   icon: '📞' },
        { path: '/salesperson/history',    label: 'My History',  icon: '🕑' },
        { path: '/salesperson/sync',       label: 'Sync Calls',  icon: '📲' },
        { path: '/salesperson/reports',    label: 'Reports',     icon: '📊' },
        { path: '/salesperson/leaderboard',label: 'Leaderboard', icon: '🏆' },
    ],
};

const ROLE_COLORS = {
    super_admin:   { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', label: 'Super Admin' },
    business_user: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', label: 'Business User' },
    salesperson:   { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', label: 'Salesperson' },
};

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar - Fixed width with proper spacing */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-30 flex flex-col shadow-2xl
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
                {/* Brand Section */}
                <div className="px-5 py-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl">📞</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-tight">Callyzer</p>
                            <p className="text-slate-400 text-xs">Call Management</p>
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="px-5 py-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-base shadow-lg shrink-0`}>
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{user?.name || 'User'}</p>
                            <p className="text-slate-400 text-xs truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <div className="mt-3 inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                        {roleConfig.label}
                    </div>
                </div>

                {/* Navigation Menu */}
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
                                        transition-all duration-200 text-left
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' 
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="text-xl w-7 text-center shrink-0">{item.icon}</span>
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-700/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <span className="text-xl w-7 text-center shrink-0">🚪</span>
                        <span className="truncate">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header - Mobile Menu Button */}
                <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 shrink-0 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-gray-800 font-semibold text-base truncate">{currentLabel}</h1>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-gray-400 text-sm hidden sm:block">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className={`w-8 h-8 rounded-full ${roleConfig.bg} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}