// import { useEffect, useState } from 'react';
// import { API_BASE_URL as API } from '../../config';

// const ROLES = ['super_admin', 'business_user', 'salesperson'];
// const FILTER_TABS = ['All', 'business_user', 'salesperson', 'Pending'];
// const ROLE_COLORS = {
//     super_admin:   { color: '#8B5CF6', soft: '#EDE9FE', label: 'Super Admin' },
//     business_user: { color: '#4F6EF7', soft: '#EEF1FE', label: 'Business User' },
//     salesperson:   { color: '#17C964', soft: '#E8FBF0', label: 'Salesperson' },
// };
// const EMPTY = { name: '', email: '', password: '', role: 'salesperson', phone: '', isActive: true };

// const getToken = () => localStorage.getItem('token');

// export default function AdminUsers() {
//     const [users, setUsers]           = useState([]);
//     const [filtered, setFiltered]     = useState([]);
//     const [loading, setLoading]       = useState(true);
//     const [search, setSearch]         = useState('');
//     const [activeFilter, setActiveFilter] = useState('All');
//     const [showModal, setShowModal]   = useState(false);
//     const [editUser, setEditUser]     = useState(null);
//     const [form, setForm]             = useState(EMPTY);
//     const [saving, setSaving]         = useState(false);
//     const [actionLoading, setActionLoading] = useState(null);
//     const [toast, setToast]           = useState('');

//     const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

//     const fetchUsers = async () => {
//         try {
//             const res  = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${getToken()}` } });
//             const data = await res.json();
//             const list = data.users || data || [];
//             setUsers(list);
//         } catch (e) { console.log(e); }
//         setLoading(false);
//     };
//     useEffect(() => { fetchUsers(); }, []);

//     useEffect(() => {
//         let list = [...users];
//         if (activeFilter === 'Pending')       list = list.filter(u => u.status === 'pending');
//         else if (activeFilter !== 'All')      list = list.filter(u => u.role === activeFilter);
//         if (search) {
//             const q = search.toLowerCase();
//             list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q));
//         }
//         setFiltered(list);
//     }, [search, users, activeFilter]);

//     const openAdd  = () => { setEditUser(null); setForm(EMPTY); setShowModal(true); };
//     const openEdit = (u) => {
//         setEditUser(u);
//         setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '', isActive: u.isActive });
//         setShowModal(true);
//     };

//     const handleSave = async () => {
//         if (!form.name || !form.email || (!editUser && !form.password)) {
//             alert('Name, email and password are required.'); return;
//         }
//         setSaving(true);
//         try {
//             const url    = editUser ? `${API}/admin/users/${editUser._id}` : `${API}/admin/users`;
//             const method = editUser ? 'PUT' : 'POST';
//             const body   = { ...form };
//             if (editUser && !body.password) delete body.password;
//             const res  = await fetch(url, {
//                 method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
//                 body: JSON.stringify(body),
//             });
//             const data = await res.json();
//             if (res.ok) { setShowModal(false); fetchUsers(); showToast(editUser ? 'User updated!' : 'User created!'); }
//             else alert(data.message || 'Failed');
//         } catch { alert('Server error'); }
//         setSaving(false);
//     };

//     const handleDelete = async (u) => {
//         if (!window.confirm(`Delete "${u.name}"?`)) return;
//         await fetch(`${API}/admin/users/${u._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
//         fetchUsers();
//         showToast('User deleted.');
//     };

//     const handleApprove = async (u) => {
//         if (!window.confirm(`Approve "${u.name}"?`)) return;
//         setActionLoading(u._id + 'approve');
//         try {
//             const res  = await fetch(`${API}/admin/users/${u._id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
//             const data = await res.json();
//             if (res.ok) { fetchUsers(); showToast('User approved!'); }
//             else alert(data.message);
//         } catch { alert('Server error'); }
//         setActionLoading(null);
//     };

//     const handleReject = async (u) => {
//         if (!window.confirm(`Reject "${u.name}"?`)) return;
//         setActionLoading(u._id + 'reject');
//         try {
//             const res  = await fetch(`${API}/admin/users/${u._id}/reject`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
//             const data = await res.json();
//             if (res.ok) { fetchUsers(); showToast('User rejected.'); }
//             else alert(data.message);
//         } catch { alert('Server error'); }
//         setActionLoading(null);
//     };

//     const handleAssign = async (userId) => {
//         try {
//             const res  = await fetch(`${API}/admin/business-users`, { headers: { Authorization: `Bearer ${getToken()}` } });
//             const data = await res.json();
//             const biz  = data.users || [];
//             if (biz.length === 0) { alert('No Business Users found. Create one first.'); return; }
//             const name = prompt(`Assign to Business User\n${biz.map((u, i) => `${i + 1}. ${u.name}`).join('\n')}\n\nEnter number (or 0 to remove):`);
//             if (name === null) return;
//             const idx = parseInt(name) - 1;
//             const bizId = idx >= 0 && idx < biz.length ? biz[idx]._id : null;
//             await fetch(`${API}/admin/users/${userId}/assign`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
//                 body: JSON.stringify({ businessUserId: bizId }),
//             });
//             fetchUsers();
//             showToast(bizId ? `Assigned to ${biz[idx].name}` : 'Assignment removed.');
//         } catch { alert('Server error'); }
//     };

//     if (loading) return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* Toast */}
//             {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold">✅ {toast}</div>}

//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
//                 <h2 className="text-xl font-extrabold text-gray-900">Manage Users</h2>
//                 <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl">+ Add User</button>
//             </div>

//             {/* Search */}
//             <div className="px-4 lg:px-6 pt-4 pb-2">
//                 <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm">
//                     <span className="text-sm">🔍</span>
//                     <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, role…" className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
//                 </div>
//             </div>

//             {/* Filter Tabs */}
//             <div className="flex gap-2 px-4 lg:px-6 py-2 overflow-x-auto">
//                 {FILTER_TABS.map(tab => (
//                     <button key={tab} onClick={() => setActiveFilter(tab)}
//                         className={`px-4 py-2 rounded-full text-xs font-bold border-2 whitespace-nowrap transition-colors ${activeFilter === tab ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
//                         {tab === 'Pending' ? '⏳ Pending' : tab === 'business_user' ? '👤 Business Users' : tab === 'salesperson' ? '💼 Salespersons' : 'All'}
//                     </button>
//                 ))}
//             </div>
//             <p className="px-4 lg:px-6 text-xs text-gray-400 mb-2">{filtered.length} users</p>

//             {/* Users List */}
//             <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-6">
//                 {filtered.length === 0 ? (
//                     <div className="text-center py-16 text-gray-400 text-sm">No users found</div>
//                 ) : (
//                     <div className="space-y-3">
//                         {filtered.map(item => {
//                             const cfg       = ROLE_COLORS[item.role] || ROLE_COLORS.salesperson;
//                             const isPending = item.status === 'pending';
//                             const isApproving = actionLoading === item._id + 'approve';
//                             const isRejecting = actionLoading === item._id + 'reject';
//                             return (
//                                 <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-start gap-3">
//                                     {/* Avatar */}
//                                     <div className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0" style={{ backgroundColor: cfg.soft, color: cfg.color }}>
//                                         {(item.name || '?').charAt(0).toUpperCase()}
//                                     </div>

//                                     {/* Info */}
//                                     <div className="flex-1 min-w-0">
//                                         <p className="font-bold text-gray-900 text-sm">{item.name}</p>
//                                         <p className="text-xs text-gray-500 mt-0.5 truncate">{item.email}</p>
//                                         <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
//                                             <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: cfg.soft, color: cfg.color }}>{cfg.label}</span>
//                                             {isPending && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">⏳ Pending</span>}
//                                             <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
//                                                 {item.isActive ? '● Active' : '● Inactive'}
//                                             </span>
//                                         </div>
//                                         {/* Approve/Reject for pending */}
//                                         {isPending && (
//                                             <div className="flex gap-2 mt-2">
//                                                 <button onClick={() => handleApprove(item)} disabled={isApproving || isRejecting}
//                                                     className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold disabled:opacity-50">
//                                                     {isApproving ? '...' : '✓ Approve'}
//                                                 </button>
//                                                 <button onClick={() => handleReject(item)} disabled={isApproving || isRejecting}
//                                                     className="px-3 py-1.5 border-2 border-red-400 text-red-600 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-red-50">
//                                                     {isRejecting ? '...' : '✗ Reject'}
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Action buttons */}
//                                     <div className="flex items-center gap-1.5 flex-shrink-0">
//                                         {item.role === 'salesperson' && (
//                                             <button onClick={() => handleAssign(item._id)} className="p-2 rounded-lg hover:bg-gray-100 text-lg" title="Assign to Business">🔗</button>
//                                         )}
//                                         <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-lg">✏️</button>
//                                         <button onClick={() => handleDelete(item)} className="p-2 rounded-lg hover:bg-red-50 text-lg">🗑️</button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//                     <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
//                         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//                             <h3 className="text-lg font-extrabold text-gray-900">{editUser ? 'Edit User' : 'Add New User'}</h3>
//                             <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
//                         </div>
//                         <div className="overflow-y-auto flex-1 p-5 space-y-4">
//                             {[
//                                 { label: 'Full Name *',   key: 'name',     type: 'text',     placeholder: 'Enter name' },
//                                 { label: 'Email *',       key: 'email',    type: 'email',    placeholder: 'Enter email' },
//                                 { label: editUser ? 'New Password (optional)' : 'Password *', key: 'password', type: 'password', placeholder: 'Enter password' },
//                                 { label: 'Phone',         key: 'phone',    type: 'tel',      placeholder: 'Enter phone' },
//                             ].map(f => (
//                                 <div key={f.key}>
//                                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">{f.label}</label>
//                                     <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//                                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" />
//                                 </div>
//                             ))}
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Role</label>
//                                 <div className="flex flex-wrap gap-2">
//                                     {ROLES.map(r => {
//                                         const cfg = ROLE_COLORS[r] || ROLE_COLORS.salesperson;
//                                         const active = form.role === r;
//                                         return (
//                                             <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
//                                                 className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${active ? 'text-white border-transparent' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}
//                                                 style={active ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}>
//                                                 {cfg.label}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between py-2">
//                                 <div>
//                                     <p className="text-sm font-bold text-gray-800">Active</p>
//                                     <p className="text-xs text-gray-500">User can log in</p>
//                                 </div>
//                                 <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
//                                     className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-indigo-600' : 'bg-gray-300'}`}>
//                                     <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="p-4 border-t border-gray-100">
//                             <button onClick={handleSave} disabled={saving}
//                                 className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm">
//                                 {saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import { API_BASE_URL as API } from '../../config';
import {
    Users, Plus, Search, Pencil, Trash2, CheckCircle2, XCircle,
    UserCheck, UserX, RefreshCcw,
} from 'lucide-react';
import {
    Button, Badge, Avatar, SearchInput, Modal, Input, Select,
    Toggle, EmptyState, Toast, LoadingPage,
} from '../../components/UI';

const ROLES = ['super_admin', 'business_user', 'salesperson'];
const FILTER_TABS = ['All', 'business_user', 'salesperson', 'Pending'];
const ROLE_CONFIG = {
    super_admin: { label: 'Super Admin', variant: 'purple' },
    business_user: { label: 'Business User', variant: 'cyan' },
    salesperson: { label: 'Salesperson', variant: 'blue' },
};
const EMPTY_FORM = { name: '', email: '', password: '', role: 'salesperson', phone: '', isActive: true };

const getToken = () => localStorage.getItem('token');

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState({ msg: '', type: 'success' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            setUsers(data.users || data || []);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        let list = [...users];
        if (activeFilter === 'Pending') list = list.filter(u => u.status === 'pending');
        else if (activeFilter !== 'All') list = list.filter(u => u.role === activeFilter);
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
        }
        setFiltered(list);
    }, [search, users, activeFilter]);

    const openAdd = () => { setEditUser(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (u) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '', isActive: u.isActive });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.email || (!editUser && !form.password)) {
            showToast('Name, email and password are required.', 'error'); return;
        }
        setSaving(true);
        try {
            const url = editUser ? `${API}/admin/users/${editUser._id}` : `${API}/admin/users`;
            const method = editUser ? 'PUT' : 'POST';
            const body = { ...form };
            if (editUser && !body.password) delete body.password;
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) { setShowModal(false); fetchUsers(); showToast(editUser ? 'User updated successfully!' : 'User created successfully!'); }
            else showToast(data.message || 'Failed to save user.', 'error');
        } catch { showToast('Server error. Please try again.', 'error'); }
        setSaving(false);
    };

    const handleDelete = async (u) => {
        if (!window.confirm(`Delete "${u.name}"? This action cannot be undone.`)) return;
        try {
            await fetch(`${API}/admin/users/${u._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
            fetchUsers();
            showToast('User deleted successfully.');
        } catch { showToast('Failed to delete user.', 'error'); }
    };

    const handleApprove = async (u) => {
        setActionLoading(u._id + 'approve');
        try {
            const res = await fetch(`${API}/admin/users/${u._id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok) { fetchUsers(); showToast('User approved!'); }
            else showToast(data.message, 'error');
        } catch { showToast('Server error.', 'error'); }
        setActionLoading(null);
    };

    const handleReject = async (u) => {
        setActionLoading(u._id + 'reject');
        try {
            const res = await fetch(`${API}/admin/users/${u._id}/reject`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok) { fetchUsers(); showToast('User rejected.', 'warning'); }
            else showToast(data.message, 'error');
        } catch { showToast('Server error.', 'error'); }
        setActionLoading(null);
    };

    return (
        <div className="space-y-5">
            <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchUsers}>Refresh</Button>
                    <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>Add User</Button>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <SearchInput
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="flex-1"
                />
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeFilter === tab
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'business_user' ? 'Business' : tab === 'salesperson' ? 'Sales' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <LoadingPage />
                ) : filtered.length === 0 ? (
                    <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filters." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Phone</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((u) => {
                                    const rc = ROLE_CONFIG[u.role] || ROLE_CONFIG.salesperson;
                                    const isPending = u.status === 'pending';
                                    return (
                                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={u.name} size="sm" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                                                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant={rc.variant}>{rc.label}</Badge>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                                                {u.phone || '—'}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {isPending ? (
                                                    <Badge variant="yellow" dot>Pending</Badge>
                                                ) : u.isActive ? (
                                                    <Badge variant="green" dot>Active</Badge>
                                                ) : (
                                                    <Badge variant="default" dot>Inactive</Badge>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {isPending ? (
                                                        <>
                                                            <Button
                                                                variant="success"
                                                                size="xs"
                                                                loading={actionLoading === u._id + 'approve'}
                                                                onClick={() => handleApprove(u)}
                                                                icon={CheckCircle2}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="xs"
                                                                loading={actionLoading === u._id + 'reject'}
                                                                onClick={() => handleReject(u)}
                                                                icon={XCircle}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => openEdit(u)}
                                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(u)}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title={editUser ? 'Edit User' : 'Add New User'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" loading={saving} onClick={handleSave}>
                            {editUser ? 'Update User' : 'Create User'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="user@company.com"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        disabled={!!editUser}
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    />
                    <Input
                        label={editUser ? 'New Password (leave blank to keep)' : 'Password'}
                        type="password"
                        placeholder={editUser ? 'Leave blank to keep current' : 'Min. 6 characters'}
                        value={form.password}
                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    />
                    <Select
                        label="Role"
                        value={form.role}
                        onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                        options={ROLES.map(r => ({ value: r, label: ROLE_CONFIG[r]?.label || r }))}
                    />
                    <div className="border-t border-slate-100 pt-3">
                        <Toggle
                            checked={form.isActive}
                            onChange={v => setForm(p => ({ ...p, isActive: v }))}
                            label="Account Active"
                            description="Allow this user to sign in"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}