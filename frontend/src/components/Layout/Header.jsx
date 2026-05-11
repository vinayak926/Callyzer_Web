import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const pageTitles = {
    '/admin/dashboard':        { title: 'Super Admin Overview',    subtitle: 'Manage your entire system' },
    '/admin/users':            { title: 'Manage Users',            subtitle: 'Create, edit and manage accounts' },
    '/admin/approvals':        { title: 'Pending Approvals',       subtitle: 'Review and approve new accounts' },
    '/admin/settings':         { title: 'Settings',                subtitle: 'System configuration' },
    '/business/dashboard':     { title: 'Business Dashboard',      subtitle: "Your team's performance overview" },
    '/business/my-team':       { title: 'My Team',                 subtitle: 'Manage your salespersons' },
    '/business/leads':          { title: 'Leads Management',   subtitle: 'Manage and track all your sales leads' },
    '/salesperson/leads':       { title: 'My Leads',           subtitle: 'View leads, call and add follow-ups' },
    '/salesperson/dashboard':  { title: 'My Dashboard',            subtitle: 'Your personal call overview' },
    '/call-logs':              { title: 'Call Logs',               subtitle: 'View all your call records' },
    '/reports':                { title: 'Reports & Analytics',     subtitle: 'Analyze your performance' },
    '/leaderboard':            { title: 'Leaderboard',             subtitle: 'Top performing salespersons' },
    '/live-feed':              { title: 'Live Feed',               subtitle: 'Real-time call activity' },
    '/call-history':           { title: 'Call History',            subtitle: 'Your complete call history' },
    '/device-sync':            { title: 'Device Call Sync',        subtitle: 'Sync calls from your device' },
};

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const currentPage = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: "Here's your overview" };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">{currentPage.title}</h1>
                        <p className="text-xs text-gray-500 hidden sm:block">{currentPage.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* User info */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-sm">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user?.email || ''}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;