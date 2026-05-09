// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import { api } from '../../services/api';
// import { API_BASE_URL } from '../../config';

// export default function MyTeam() {
//     const { user } = useContext(AuthContext);
//     const [members, setMembers] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [editMember, setEditMember] = useState(null);
//     const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
//     const [saving, setSaving] = useState(false);
//     const [toast, setToast] = useState('');

//     const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

//     const fetchTeam = async () => {
//         try {
//             const data = await api.getMyTeam();
//             const list = data.salespersons || data.users || data || [];
//             setMembers(list);
//             setFiltered(list);
//         } catch (e) { console.log('MyTeam fetch error:', e); }
//         setLoading(false);
//     };

//     useEffect(() => { fetchTeam(); }, []);

//     useEffect(() => {
//         if (!search.trim()) { setFiltered(members); return; }
//         const q = search.toLowerCase();
//         setFiltered(members.filter(m => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)));
//     }, [search, members]);

//     const openAdd = () => {
//         setEditMember(null);
//         setForm({ name: '', email: '', password: '', phone: '' });
//         setShowModal(true);
//     };

//     const openEdit = (m) => {
//         setEditMember(m);
//         setForm({ name: m.name, email: m.email, password: '', phone: m.phone || '' });
//         setShowModal(true);
//     };

//     const handleSave = async () => {
//         if (!form.name.trim() || !form.email.trim() || (!editMember && !form.password)) {
//             alert('Name, email and password are required.');
//             return;
//         }
//         if (!editMember && form.password.length < 6) {
//             alert('Password must be at least 6 characters.');
//             return;
//         }
//         setSaving(true);
//         try {
//             if (editMember) {
//                 const body = { name: form.name, phone: form.phone };
//                 if (form.password) body.password = form.password;
//                 await api.updateSalesperson(editMember._id, body);
//                 showToast('Salesperson updated successfully!');
//             } else {
//                 await api.createSalesperson({
//                     name: form.name.trim(),
//                     email: form.email.trim(),
//                     password: form.password,
//                     phone: form.phone.trim(),
//                 });
//                 showToast('Salesperson added successfully!');
//             }
//             setShowModal(false);
//             fetchTeam();
//         } catch { alert('Network error. Please try again.'); }
//         setSaving(false);
//     };

//     const handleToggleStatus = async (m) => {
//         if (!window.confirm(`${m.isActive ? 'Deactivate' : 'Activate'} "${m.name}"?`)) return;
//         try {
//             await api.toggleSalespersonStatus(m._id);
//             fetchTeam();
//             showToast(`${m.name} ${m.isActive ? 'deactivated' : 'activated'}.`);
//         } catch { alert('Network error.'); }
//     };

//     const handleResetPassword = async (m) => {
//         if (!window.confirm(`Reset password for "${m.name}"? A new temporary password will be set.`)) return;
//         try {
//             await api.resetSalespersonPassword(m._id, 'Welcome@123');
//             alert(`Password reset to: Welcome@123\nAsk ${m.name} to change it after login.`);
//         } catch { alert('Network error.'); }
//     };

//     if (loading) return (
//         <div className="flex items-center justify-center h-96">
//             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//     );

//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold z-50">✅ {toast}</div>}

//             {/* Header */}
//             <div className="flex items-center justify-between mb-5">
//                 <div>
//                     <h2 className="text-xl font-extrabold text-gray-900">My Team</h2>
//                     <p className="text-xs text-gray-500">{filtered.length} member{filtered.length !== 1 ? 's' : ''} · {members.filter(m => m.isActive).length} active</p>
//                 </div>
//                 <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl">+ Add Salesperson</button>
//             </div>

//             {/* Search */}
//             <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm mb-4">
//                 <span className="text-sm">🔍</span>
//                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
//             </div>

//             {/* Members List */}
//             <div className="space-y-3">
//                 {filtered.length === 0 ? (
//                     <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
//                         <div className="text-5xl mb-3">👥</div>
//                         <p className="text-gray-700 font-bold">No Team Members Yet</p>
//                         <p className="text-gray-400 text-sm mt-1">Tap "+ Add Salesperson" to add your first team member.</p>
//                     </div>
//                 ) : (
//                     filtered.map((m, idx) => (
//                         <div key={m._id || idx} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
//                             <div className="flex items-start gap-3">
//                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${m.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
//                                     {(m.name || 'S').charAt(0).toUpperCase()}
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center justify-between flex-wrap gap-2">
//                                         <p className="font-bold text-gray-900">{m.name}</p>
//                                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
//                                             {m.isActive ? 'Active' : 'Inactive'}
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-500 truncate">{m.email}</p>
//                                     {m.phone && <p className="text-xs text-gray-400 mt-0.5">📱 {m.phone}</p>}
//                                     {m.todayCalls !== undefined && (
//                                         <p className="text-xs text-indigo-600 mt-1">📞 Today's calls: {m.todayCalls ?? 0}</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
//                                 <button onClick={() => openEdit(m)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">✏️ Edit</button>
//                                 <button onClick={() => handleToggleStatus(m)} className={`flex-1 py-2 border text-xs font-bold rounded-lg ${m.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
//                                     {m.isActive ? '🚫 Deactivate' : '✅ Activate'}
//                                 </button>
//                                 <button onClick={() => handleResetPassword(m)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">🔑 Reset Pwd</button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//                     <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
//                         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//                             <h3 className="text-lg font-extrabold text-gray-900">{editMember ? '✏️ Edit Member' : '➕ Add Salesperson'}</h3>
//                             <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
//                         </div>
//                         <div className="overflow-y-auto flex-1 p-5 space-y-4">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Full Name *</label>
//                                 <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
//                             </div>
//                             {!editMember && (
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Email *</label>
//                                     <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="salesperson@company.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
//                                 </div>
//                             )}
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Phone</label>
//                                 <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" maxLength={10} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
//                                     Password {editMember ? '(leave blank to keep current)' : '*'}
//                                 </label>
//                                 <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editMember ? 'New password (optional)' : 'Min. 6 characters'} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
//                             </div>
//                         </div>
//                         <div className="p-4 border-t border-gray-100 flex gap-3">
//                             <button onClick={() => setShowModal(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm">Cancel</button>
//                             <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm">
//                                 {saving ? 'Saving...' : editMember ? 'Save Changes' : 'Add Member'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import { API_BASE_URL } from '../../config';
import {
    UserSquare, Plus, Search, Pencil, Power, KeyRound, Phone, Mail, RefreshCcw,
} from 'lucide-react';
import {
    Button, Badge, Avatar, SearchInput, Modal, Input, Toast,
    EmptyState, LoadingPage, SectionHeader,
} from '../../components/UI';

export default function MyTeam() {
    const { user } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMember, setEditMember] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ msg: '', type: 'success' });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '' }), 3000);
    };

    const fetchTeam = async () => {
        try {
            const data = await api.getMyTeam();
            const list = data.salespersons || data.users || data || [];
            setMembers(list);
            setFiltered(list);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { fetchTeam(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(members); return; }
        const q = search.toLowerCase();
        setFiltered(members.filter(m =>
            m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)
        ));
    }, [search, members]);

    const openAdd = () => {
        setEditMember(null);
        setForm({ name: '', email: '', password: '', phone: '' });
        setShowModal(true);
    };

    const openEdit = (m) => {
        setEditMember(m);
        setForm({ name: m.name, email: m.email, password: '', phone: m.phone || '' });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.email.trim() || (!editMember && !form.password)) {
            showToast('Name, email and password are required.', 'error'); return;
        }
        if (!editMember && form.password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error'); return;
        }
        setSaving(true);
        try {
            if (editMember) {
                const body = { name: form.name, phone: form.phone };
                if (form.password) body.password = form.password;
                await api.updateSalesperson(editMember._id, body);
                showToast('Salesperson updated successfully!');
            } else {
                await api.createSalesperson({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    phone: form.phone.trim(),
                });
                showToast('Salesperson added successfully!');
            }
            setShowModal(false);
            fetchTeam();
        } catch { showToast('Network error. Please try again.', 'error'); }
        setSaving(false);
    };

    const handleToggleStatus = async (m) => {
        if (!window.confirm(`${m.isActive ? 'Deactivate' : 'Activate'} "${m.name}"?`)) return;
        try {
            await api.toggleSalespersonStatus(m._id);
            fetchTeam();
            showToast(`${m.name} ${m.isActive ? 'deactivated' : 'activated'}.`);
        } catch { showToast('Network error.', 'error'); }
    };

    const handleResetPassword = async (m) => {
        if (!window.confirm(`Reset password for "${m.name}"?`)) return;
        try {
            await api.resetSalespersonPassword(m._id, 'Welcome@123');
            showToast(`Password reset to Welcome@123. Ask ${m.name} to change it after login.`);
        } catch { showToast('Network error.', 'error'); }
    };

    const activeCount = members.filter(m => m.isActive).length;
    const inactiveCount = members.filter(m => !m.isActive).length;

    if (loading) return <LoadingPage />;

    return (
        <div className="space-y-5">
            <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">My Team</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {filtered.length} member{filtered.length !== 1 ? 's' : ''} · {activeCount} active · {inactiveCount} inactive
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={fetchTeam}>Refresh</Button>
                    <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>Add Salesperson</Button>
                </div>
            </div>

            {/* Search */}
            <SearchInput
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
            />

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <EmptyState
                        icon={UserSquare}
                        title="No team members found"
                        description="Add salespersons to your team to get started."
                        action={<Button variant="primary" icon={Plus} onClick={openAdd}>Add First Member</Button>}
                    />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((m) => (
                        <div
                            key={m._id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar name={m.name} size="lg" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{m.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{m.email}</p>
                                    </div>
                                </div>
                                <Badge variant={m.isActive ? 'green' : 'default'} dot>
                                    {m.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Mail size={12} className="shrink-0 text-slate-400" />
                                    <span className="truncate">{m.email}</span>
                                </div>
                                {m.phone && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Phone size={12} className="shrink-0 text-slate-400" />
                                        <span>{m.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-50">
                                <Button variant="secondary" size="xs" icon={Pencil} onClick={() => openEdit(m)} className="flex-1">Edit</Button>
                                <Button variant="secondary" size="xs" icon={KeyRound} onClick={() => handleResetPassword(m)} className="flex-1">Reset</Button>
                                <button
                                    onClick={() => handleToggleStatus(m)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 h-7 px-3 text-xs font-semibold rounded-xl transition-all ${m.isActive
                                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        }`}
                                >
                                    <Power size={12} />
                                    {m.isActive ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                title={editMember ? 'Edit Salesperson' : 'Add New Salesperson'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" loading={saving} onClick={handleSave}>
                            {editMember ? 'Update' : 'Add Salesperson'}
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
                        placeholder="salesperson@company.com"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        disabled={!!editMember}
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="10-digit number"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    />
                    <Input
                        label={editMember ? 'New Password (leave blank to keep)' : 'Password'}
                        type="password"
                        placeholder={editMember ? 'Leave blank to keep current' : 'Min. 6 characters'}
                        value={form.password}
                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    />
                </div>
            </Modal>
        </div>
    );
}