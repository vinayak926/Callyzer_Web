import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Button ──────────────────────────────────────────────────────────────────
export function Button({
    children, onClick, type = 'button', variant = 'primary',
    size = 'md', disabled = false, loading = false, className = '', icon: Icon,
}) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
        secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0',
        danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm shadow-rose-200 hover:shadow-md hover:shadow-rose-300 hover:-translate-y-0.5 active:translate-y-0',
        ghost: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:shadow-sm',
        success: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0',
        outline: 'bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-50 active:bg-blue-100 hover:border-blue-600 hover:shadow-sm hover:shadow-blue-100',
    };

    const sizes = {
        xs: 'h-7 px-3 text-xs',
        sm: 'h-8 px-3.5 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        xl: 'h-12 px-6 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
            {children}
        </button>
    );
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', dot = false, className = '' }) {
    const variants = {
        default: 'bg-slate-100 text-slate-600',
        blue: 'bg-blue-50 text-blue-700',
        cyan: 'bg-cyan-50 text-cyan-700',
        green: 'bg-emerald-50 text-emerald-700',
        yellow: 'bg-amber-50 text-amber-700',
        red: 'bg-rose-50 text-rose-700',
        purple: 'bg-purple-50 text-purple-700',
        navy: 'bg-slate-800 text-slate-100',
    };
    const dotColors = {
        default: 'bg-slate-400', blue: 'bg-blue-500', cyan: 'bg-cyan-500',
        green: 'bg-emerald-500', yellow: 'bg-amber-500', red: 'bg-rose-500',
        purple: 'bg-purple-500', navy: 'bg-slate-300',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
            {children}
        </span>
    );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, padding = true }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-200 ${hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''} ${padding ? 'p-5' : ''} ${className}`}>
            {children}
        </div>
    );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color, bgColor, sub, trend, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 ${onClick ? 'cursor-pointer active:translate-y-0 active:shadow-sm' : ''} animate-fade-in`}
            style={{ borderTop: `3px solid ${color}` }}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                >
                    <Icon size={20} style={{ color }} />
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value ?? '0'}</p>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

// ── Input ───────────────────────────────────────────────────────────────────
export function Input({
    label, error, icon: Icon, iconRight: IconRight, onIconRightClick,
    className = '', ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    {...props}
                    className={`input-field ${Icon ? 'pl-10' : ''} ${IconRight ? 'pr-10' : ''} ${error ? 'border-rose-400 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.1)]' : 'focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'}`}
                />
                {IconRight && (
                    <button
                        type="button"
                        onClick={onIconRightClick}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <IconRight size={16} />
                    </button>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
        </div>
    );
}

// ── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, options = [], className = '', ...props }) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    {label}
                </label>
            )}
            <select
                {...props}
                className="input-field appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', color = 'blue' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    const colors = { blue: 'border-blue-500', white: 'border-white', slate: 'border-slate-500' };
    return (
        <div className={`${sizes[size]} border-[3px] ${colors[color]} border-t-transparent rounded-full animate-spin-custom`} />
    );
}

// ── Loading Page ─────────────────────────────────────────────────────────────
export function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center h-72 gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
    );
}

// ── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Icon size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
            <p className="text-sm text-slate-400 max-w-xs">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// ── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-700',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        warning: 'bg-amber-50 border-amber-200 text-amber-700',
        error: 'bg-rose-50 border-rose-200 text-rose-700',
    };
    const icons = {
        info: 'ℹ', success: '✓', warning: '⚠', error: '✕',
        
    };
    return (
        <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}>
            <span className="shrink-0 mt-0.5 font-bold">{icons[type]}</span>
            <span>{children}</span>
        </div>
    );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl animate-scale-in`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        ✕
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
                {footer && <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">{footer}</div>}
            </div>
        </div>
    );
}

// ── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
    const styles = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        info: 'bg-blue-600 text-white',
        warning: 'bg-amber-500 text-white',
    };
    if (!message) return null;
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold animate-toast ${styles[type]}`}>
            {message}
            <button onClick={onClose} className="ml-1 opacity-75 hover:opacity-100">✕</button>
        </div>
    );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#06B6D4'];
export function Avatar({ name = '', size = 'md', color }) {
    const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    const bg = color || AVATAR_COLORS[idx];
    const sizes = { xs: 'w-7 h-7 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base', xl: 'w-14 h-14 text-lg' };
    return (
        <div
            className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
            style={{ backgroundColor: bg }}
        >
            {(name || 'U').charAt(0).toUpperCase()}
        </div>
    );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, description }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}

// ── Search Input ──────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-field pl-9"
            />
        </div>
    );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, emptyState, loading }) {
    if (loading) return (
        <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
    );
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-100">
                        {columns.map(col => (
                            <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-16 text-sm text-slate-400">
                                {emptyState || 'No data available'}
                            </td>
                        </tr>
                    ) : data.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            {columns.map(col => (
                                <td key={col.key} className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = '#3B82F6', height = 6 }) {
    const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
    return (
        <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: '#F1F5F9' }}>
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
            />
        </div>
    );
}

// ── Section Header ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}