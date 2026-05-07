import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';
import { API_BASE_URL } from '../../config';

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
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchTeam = async () => {
        try {
            const data = await api.getMyTeam();
            const list = data.salespersons || data.users || data || [];
            setMembers(list);
            setFiltered(list);
        } catch (e) { console.log('MyTeam fetch error:', e); }
        setLoading(false);
    };

    useEffect(() => { fetchTeam(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(members); return; }
        const q = search.toLowerCase();
        setFiltered(members.filter(m => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)));
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
            alert('Name, email and password are required.');
            return;
        }
        if (!editMember && form.password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
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
        } catch { alert('Network error. Please try again.'); }
        setSaving(false);
    };

    const handleToggleStatus = async (m) => {
        if (!window.confirm(`${m.isActive ? 'Deactivate' : 'Activate'} "${m.name}"?`)) return;
        try {
            await api.toggleSalespersonStatus(m._id);
            fetchTeam();
            showToast(`${m.name} ${m.isActive ? 'deactivated' : 'activated'}.`);
        } catch { alert('Network error.'); }
    };

    const handleResetPassword = async (m) => {
        if (!window.confirm(`Reset password for "${m.name}"? A new temporary password will be set.`)) return;
        try {
            await api.resetSalespersonPassword(m._id, 'Welcome@123');
            alert(`Password reset to: Welcome@123\nAsk ${m.name} to change it after login.`);
        } catch { alert('Network error.'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold z-50">✅ {toast}</div>}

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900">My Team</h2>
                    <p className="text-xs text-gray-500">{filtered.length} member{filtered.length !== 1 ? 's' : ''} · {members.filter(m => m.isActive).length} active</p>
                </div>
                <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl">+ Add Salesperson</button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm mb-4">
                <span className="text-sm">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
            </div>

            {/* Members List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="text-gray-700 font-bold">No Team Members Yet</p>
                        <p className="text-gray-400 text-sm mt-1">Tap "+ Add Salesperson" to add your first team member.</p>
                    </div>
                ) : (
                    filtered.map((m, idx) => (
                        <div key={m._id || idx} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${m.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {(m.name || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <p className="font-bold text-gray-900">{m.name}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {m.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{m.email}</p>
                                    {m.phone && <p className="text-xs text-gray-400 mt-0.5">📱 {m.phone}</p>}
                                    {m.todayCalls !== undefined && (
                                        <p className="text-xs text-indigo-600 mt-1">📞 Today's calls: {m.todayCalls ?? 0}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button onClick={() => openEdit(m)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">✏️ Edit</button>
                                <button onClick={() => handleToggleStatus(m)} className={`flex-1 py-2 border text-xs font-bold rounded-lg ${m.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                                    {m.isActive ? '🚫 Deactivate' : '✅ Activate'}
                                </button>
                                <button onClick={() => handleResetPassword(m)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50">🔑 Reset Pwd</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">{editMember ? '✏️ Edit Member' : '➕ Add Salesperson'}</h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Full Name *</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
                            </div>
                            {!editMember && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Email *</label>
                                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="salesperson@company.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Phone</label>
                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" maxLength={10} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                                    Password {editMember ? '(leave blank to keep current)' : '*'}
                                </label>
                                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editMember ? 'New password (optional)' : 'Min. 6 characters'} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900" />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl text-sm">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm">
                                {saving ? 'Saving...' : editMember ? 'Save Changes' : 'Add Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}