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
        { path: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        { path: '/admin/approvals',   label: 'Approvals',   icon: ClipboardCheck },
        { path: '/admin/users',       label: 'Users',       icon: Users },
        { path: '/admin/call-logs',   label: 'Call Logs',   icon: Phone },
        { path: '/admin/reports',     label: 'Reports',     icon: BarChart2 },
        { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
        { path: '/admin/settings',    label: 'Settings',    icon: Settings },
    ],
    business_user: [
        { path: '/business/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        { path: '/business/live-feed',   label: 'Live Feed',   icon: Radio },
        { path: '/business/team',        label: 'My Team',     icon: UserSquare },
        { path: '/business/call-logs',   label: 'Call Logs',   icon: Phone },
        { path: '/business/sync',        label: 'Sync Calls',  icon: Smartphone },
        { path: '/business/reports',     label: 'Reports',     icon: BarChart2 },
        { path: '/business/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
    salesperson: [
        { path: '/salesperson/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
        { path: '/salesperson/call-logs',   label: 'Call Logs',   icon: Phone },
        { path: '/salesperson/history',     label: 'My History',  icon: History },
        { path: '/salesperson/sync',        label: 'Sync Calls',  icon: Smartphone },
        { path: '/salesperson/reports',     label: 'Reports',     icon: BarChart2 },
        { path: '/salesperson/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
};

// Light theme palette
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

export default function Sidebar({ open, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = MENUS[user?.role] || [];
    const roleConf  = ROLE_CONFIG[user?.role] || ROLE_CONFIG.salesperson;

    const go       = (path) => { navigate(path); onClose?.(); };
    const doLogout = ()     => { logout(); navigate('/login'); };

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
            )}

            <aside
                style={{ width: 260, background: S.bg, borderRight: `1px solid ${S.border}` }}
                className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}
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
                        onClick={onClose}
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
        </>
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
            {/* Left active indicator bar */}
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
