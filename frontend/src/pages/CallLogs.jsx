// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { api } from '../services/api';
// import { AuthContext } from '../context/AuthContext';
// import { API_BASE_URL } from '../config';

// // ── Helpers ────────────────────────────────────────────
// const fmtDuration = (s) => {
//     if (!s && s !== 0) return '—';
//     const sec = Number(s);
//     if (isNaN(sec)) return '—';
//     const m = Math.floor(sec / 60), r = sec % 60;
//     return m > 0 ? `${m}m ${r}s` : `${r}s`;
// };
// const fmtDate = (d) => {
//     if (!d) return '—';
//     const dt = new Date(d);
//     return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
// };
// const fmtTime = (d) => {
//     if (!d) return '';
//     const dt = new Date(d);
//     return isNaN(dt.getTime()) ? '' : dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
// };
// const getPresetDates = (preset) => {
//     const today = new Date();
//     const fmt = (d) => d.toISOString().split('T')[0];
//     const sub = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };
//     switch (preset) {
//         case 'today': return { from: fmt(today), to: fmt(today) };
//         case 'yesterday': return { from: fmt(sub(today, 1)), to: fmt(sub(today, 1)) };
//         case 'last7': return { from: fmt(sub(today, 6)), to: fmt(today) };
//         case 'last30': return { from: fmt(sub(today, 29)), to: fmt(today) };
//         default: return { from: '', to: '' };
//     }
// };

// const TYPE_COLORS = { Incoming: 'bg-blue-100 text-blue-700', Outgoing: 'bg-purple-100 text-purple-700' };
// const STATUS_COLORS = { Connected: 'bg-green-100 text-green-700', Missed: 'bg-red-100 text-red-700', Rejected: 'bg-amber-100 text-amber-700' };
// const DISP_COLORS = {
//     'Interested': 'bg-green-100 text-green-700',
//     'Not Interested': 'bg-red-100 text-red-700',
//     'Sale Done': 'bg-purple-100 text-purple-700',
//     'Callback': 'bg-amber-100 text-amber-700',
//     'Wrong Number': 'bg-gray-100 text-gray-600',
//     'Follow-up': 'bg-blue-100 text-blue-700',
// };
// const AV_COLORS = ['#4A68F0', '#7322C0', '#16BE62', '#F0204E', '#F0991A', '#0AAECC'];
// // NEW — Dial Button: triggers call on mobile via extension or direct API
// function DialButton({ phone, name }) {
//     const [state, setState] = React.useState('idle'); // idle|dialing|sent|error
//     const [msg, setMsg] = React.useState('');

//     const handleDial = async (e) => {
//         e.stopPropagation();
//         if (state === 'dialing') return;
//         setState('dialing');
//         try {
//             // Try extension bridge first (if extension installed)
//             window.postMessage({
//                 type: 'CALLYZER_DIAL',
//                 phone,
//                 name: name || 'Unknown',
//                 token: localStorage.getItem('token'),
//             }, '*');
//             // Also call API directly as fallback
//             // (extension will also call API, so only one reaches mobile)
//             const res = await api.triggerDial(phone, name);
//             if (res.success) {
//                 setState('sent');
//                 setMsg(res.socketSent ? 'Sent to mobile' : 'Open mobile app');
//             } else {
//                 setState('error');
//                 setMsg(res.message || 'Failed');
//             }
//         } catch {
//             setState('error');
//             setMsg('Connection error');
//         }
//         setTimeout(() => { setState('idle'); setMsg(''); }, 3000);
//     };

//     const cfg = {
//         idle: { cls: 'bg-green-50 hover:bg-green-100 text-green-600', icon: '\u260E' },
//         dialing: { cls: 'bg-yellow-50 text-yellow-600', icon: '...' },
//         sent: { cls: 'bg-blue-50 text-blue-600', icon: '\u2713' },
//         error: { cls: 'bg-red-50 text-red-600', icon: '\u2715' },
//     }[state];

//     return (
//         <div className="relative inline-flex items-center">
//             <button
//                 onClick={handleDial}
//                 title={`Call ${phone} on mobile app`}
//                 className={`
//                     opacity-0 group-hover:opacity-100 transition-all duration-150
//                     ${cfg.cls} w-7 h-7 rounded-lg flex items-center justify-center
//                     text-xs border border-current border-opacity-20 ml-2
//                     ${state === 'dialing' ? 'cursor-wait' : 'cursor-pointer'}
//                 `}
//             >{cfg.icon}</button>
//             {msg && (
//                 <span className={`absolute left-10 top-0 whitespace-nowrap text-xs
//                     font-semibold px-2 py-1 rounded-md shadow-sm z-10`,
//                     `${cfg.cls} border border-current border-opacity-20`}
//                 >{msg}</span>
//             )}
//         </div>
//     );
// }

// // ── Call Modal ─────────────────────────────────────────
// function CallModal({ show, onClose, onDone, log }) {
//     const isEdit = !!log;
//     const empty = {
//         customerName: '', customerNumber: '',
//         callType: 'Outgoing', callStatus: 'Connected',
//         durationSeconds: '',
//         calledAt: new Date().toISOString().slice(0, 16),
//         notes: '', disposition: '', followUpDate: '', followUpNotes: '',
//     };
//     const [form, setForm] = useState(empty);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (!show) return;
//         if (log) {
//             setForm({
//                 customerName: log.customerName || '',
//                 customerNumber: log.customerNumber || '',
//                 callType: log.callType || 'Outgoing',
//                 callStatus: log.callStatus || 'Connected',
//                 durationSeconds: log.durationSeconds?.toString() || '',
//                 calledAt: log.calledAt ? new Date(log.calledAt).toISOString().slice(0, 16) : '',
//                 notes: log.notes || '',
//                 disposition: log.disposition || '',
//                 followUpDate: log.followUpDate ? new Date(log.followUpDate).toISOString().split('T')[0] : '',
//                 followUpNotes: log.followUpNotes || '',
//             });
//         } else {
//             setForm(empty);
//         }
//         setError('');
//     }, [show, log]);

//     const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!form.customerNumber.trim()) { setError('Phone number is required'); return; }
//         setSaving(true); setError('');
//         try {
//             const callData = {
//                 customerName: form.customerName.trim() || 'Unknown',
//                 customerNumber: form.customerNumber.trim(),
//                 callType: form.callType,
//                 callStatus: form.callStatus,
//                 durationSeconds: Number(form.durationSeconds) || 0,
//                 calledAt: form.calledAt ? new Date(form.calledAt).toISOString() : new Date().toISOString(),
//                 notes: form.notes,
//                 disposition: form.disposition,
//                 followUpDate: form.followUpDate || null,
//                 followUpNotes: form.followUpNotes,
//             };
//             if (isEdit) await api.updateCallLog(log._id, callData);
//             else await api.createCallLog(callData);
//             onDone(isEdit ? 'Call log updated!' : 'Call log added!');
//         } catch {
//             setError('Something went wrong. Please try again.');
//         } finally {
//             setSaving(false);
//         }
//     };

//     const CALL_TYPES = ['Outgoing', 'Incoming'];
//     const CALL_STATUSES = ['Connected', 'Missed', 'Rejected'];
//     const DISPOSITIONS = ['', 'Interested', 'Not Interested', 'Callback', 'Sale Done', 'Wrong Number', 'Follow-up'];

//     if (!show) return null;
//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//             <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
//                 <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//                     <h3 className="text-lg font-extrabold text-gray-900">{isEdit ? '✏️ Edit Call Log' : '📞 New Call Log'}</h3>
//                     <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
//                 </div>
//                 <div className="overflow-y-auto flex-1 p-5">
//                     {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}
//                     <form onSubmit={handleSubmit} id="callform" className="space-y-4">
//                         <div className="grid grid-cols-2 gap-3">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Customer Name</label>
//                                 <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" placeholder="Rahul Sharma" value={form.customerName} onChange={e => set('customerName', e.target.value)} />
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Phone <span className="text-red-500">*</span></label>
//                                 <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" placeholder="+91 98765 43210" value={form.customerNumber} onChange={e => set('customerNumber', e.target.value)} />
//                             </div>
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Call Type</label>
//                             <div className="flex gap-2">{CALL_TYPES.map(t => <button key={t} type="button" onClick={() => set('callType', t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.callType === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}>{t}</button>)}</div>
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Call Status</label>
//                             <div className="flex gap-2">{CALL_STATUSES.map(s => <button key={s} type="button" onClick={() => set('callStatus', s)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${form.callStatus === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}>{s}</button>)}</div>
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Disposition</label>
//                             <div className="flex flex-wrap gap-2">{DISPOSITIONS.map(d => <button key={d} type="button" onClick={() => set('disposition', d)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-colors ${form.disposition === d ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300'}`}>{d || 'None'}</button>)}</div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-3">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Duration (sec)</label>
//                                 <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" placeholder="120" value={form.durationSeconds} onChange={e => set('durationSeconds', e.target.value)} />
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Date & Time</label>
//                                 <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" value={form.calledAt} onChange={e => set('calledAt', e.target.value)} />
//                             </div>
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Follow-up Date</label>
//                             <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Follow-up Notes</label>
//                             <textarea rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 resize-none" placeholder="Follow-up notes..." value={form.followUpNotes} onChange={e => set('followUpNotes', e.target.value)} />
//                         </div>
//                         <div>
//                             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Notes</label>
//                             <textarea rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 resize-none" placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
//                         </div>
//                     </form>
//                 </div>
//                 <div className="flex gap-3 p-4 border-t border-gray-100">
//                     <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
//                     <button type="submit" form="callform" disabled={saving} className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold transition-colors">
//                         {saving ? 'Saving…' : isEdit ? 'Update Call' : 'Add Call'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Delete Confirm Modal ───────────────────────────────
// function DeleteModal({ show, onClose, onDone, log }) {
//     const [deleting, setDeleting] = useState(false);
//     if (!show || !log) return null;
//     const handleDelete = async () => {
//         setDeleting(true);
//         try { await api.deleteCallLog(log._id); onDone('Call log deleted.'); }
//         catch { onClose(); }
//         finally { setDeleting(false); }
//     };
//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
//                 <div className="text-5xl mb-4">🗑️</div>
//                 <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Call Log?</h3>
//                 <p className="text-sm text-gray-500 mb-6">{log.customerName || 'This record'} • {log.customerNumber || ''}<br />This action cannot be undone.</p>
//                 <div className="flex gap-3">
//                     <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
//                     <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold">
//                         {deleting ? 'Deleting...' : 'Delete'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Bulk Import Modal ──────────────────────────────────
// function BulkImportModal({ show, onClose, onDone }) {
//     const [csv, setCsv] = useState('');
//     const [importing, setImporting] = useState(false);
//     const [error, setError] = useState('');
//     const [preview, setPreview] = useState(0);

//     const parseCSVLine = (line) => {
//         const result = []; let current = '', inQuotes = false;
//         for (const ch of line) {
//             if (ch === '"') inQuotes = !inQuotes;
//             else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
//             else current += ch;
//         }
//         result.push(current.trim());
//         return result;
//     };
//     const normalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
//     const isHeaderRow = (r) => r.toLowerCase().includes('name') && r.toLowerCase().includes('phone');

//     useEffect(() => {
//         if (!csv.trim()) { setPreview(0); return; }
//         const lines = csv.trim().split('\n').filter(l => l.trim());
//         const data = isHeaderRow(lines[0]) ? lines.slice(1) : lines;
//         const valid = data.filter(l => { const c = parseCSVLine(l); return c.length >= 2 && c[1] && c[1].replace(/\D/g, '').length >= 7; });
//         setPreview(valid.length);
//     }, [csv]);

//     const handleImport = async () => {
//         if (!csv.trim()) { setError('Please paste CSV data first.'); return; }
//         setImporting(true); setError('');
//         try {
//             const lines = csv.trim().split('\n').filter(l => l.trim());
//             const data = isHeaderRow(lines[0]) ? lines.slice(1) : lines;
//             const calls = []; const errors = [];
//             data.forEach((line, idx) => {
//                 const cols = parseCSVLine(line);
//                 const phone = cols[1]?.replace(/\s/g, '') || '';
//                 if (!phone || phone.replace(/\D/g, '').length < 7) { errors.push(`Row ${idx + 1}: Invalid phone`); return; }
//                 let calledAt = new Date().toISOString();
//                 if (cols[5]?.trim()) { const p = new Date(cols[5].trim()); if (!isNaN(p.getTime())) calledAt = p.toISOString(); }
//                 let callType = normalize(cols[2] || 'Outgoing'); if (callType !== 'Incoming') callType = 'Outgoing';
//                 let callStatus = normalize(cols[3] || 'Connected'); if (!['Connected', 'Missed', 'Rejected'].includes(callStatus)) callStatus = 'Connected';
//                 calls.push({ customerName: cols[0]?.trim() || 'Unknown', customerNumber: phone, callType, callStatus, durationSeconds: parseInt(cols[4]) || 0, calledAt, notes: cols[6]?.trim() || '', disposition: cols[7]?.trim() || '' });
//             });
//             if (errors.length > 0) { setError(errors.slice(0, 3).join(', ')); setImporting(false); return; }
//             if (calls.length === 0) { setError('No valid rows found.'); setImporting(false); return; }
//             await api.bulkCreateCallLogs(calls);
//             setCsv('');
//             onDone(`${calls.length} call(s) imported!`);
//         } catch { setError('Import failed. Please try again.'); }
//         finally { setImporting(false); }
//     };

//     if (!show) return null;
//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//             <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
//                 <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//                     <h3 className="text-lg font-extrabold text-gray-900">📥 Bulk Import Calls</h3>
//                     <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
//                 </div>
//                 <div className="overflow-y-auto flex-1 p-5 space-y-4">
//                     <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//                         <p className="text-indigo-800 font-bold text-sm mb-1">📋 CSV Format (No Header Row)</p>
//                         <p className="text-indigo-700 text-xs">Name, Phone, Type, Status, Duration(sec), Date, Notes, Disposition</p>
//                         <div className="bg-white rounded-lg p-3 mt-2 border border-indigo-100">
//                             <p className="text-xs font-bold text-gray-700 mb-1">✅ Example:</p>
//                             <code className="text-xs text-gray-600 font-mono">Rahul,9876543210,Outgoing,Connected,120,2026-04-21,note,Interested</code>
//                         </div>
//                     </div>
//                     {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>}
//                     {preview > 0 && !error && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-bold">✅ {preview} valid row{preview > 1 ? 's' : ''} ready to import</div>}
//                     <div>
//                         <label className="text-sm font-bold text-gray-600 block mb-2">Paste CSV Data:</label>
//                         <textarea rows={8} value={csv} onChange={e => { setCsv(e.target.value); setError(''); }} placeholder="Rahul,9876543210,Outgoing,Connected,120,2026-04-21,note,Interested" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-800 outline-none focus:border-indigo-500 resize-none" />
//                     </div>
//                 </div>
//                 <div className="flex gap-3 p-4 border-t border-gray-100">
//                     <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
//                     <button onClick={handleImport} disabled={importing || preview === 0} className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold">
//                         {importing ? 'Importing…' : preview > 0 ? `Import ${preview} row${preview > 1 ? 's' : ''}` : 'Import'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Main Component ─────────────────────────────────────
// export default function CallLogs() {
//     const { user } = useContext(AuthContext);
//     const [logs, setLogs] = useState([]);
//     const [stats, setStats] = useState(null);
//     const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState(null);

//     const [search, setSearch] = useState('');
//     const [typeFilter, setTypeFilter] = useState('All');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [dateFrom, setDateFrom] = useState('');
//     const [dateTo, setDateTo] = useState('');
//     const [activePreset, setActivePreset] = useState('');
//     const [page, setPage] = useState(1);
//     const [sortField, setSortField] = useState('calledAt');
//     const [sortDir, setSortDir] = useState('desc');
//     const [agents, setAgents] = useState([]);
//     const [selectedAgent, setSelectedAgent] = useState('');

//     const [showAdd, setShowAdd] = useState(false);
//     const [showImport, setShowImport] = useState(false);
//     const [editLog, setEditLog] = useState(null);
//     const [deleteLog, setDeleteLog] = useState(null);
//     const [toast, setToast] = useState('');

//     const userRole = user?.role || 'salesperson';
//     const canAdd = ['salesperson', 'business_user', 'super_admin'].includes(userRole);
//     const isAdmin = ['super_admin'].includes(userRole);
//     const canDelete = userRole === 'super_admin';
//     const canViewAll = ['super_admin', 'business_user'].includes(userRole);

//     useEffect(() => {
//         if (canViewAll) {
//             api.getCallLogs({ limit: 100 }).then(res => {
//                 // agents would come from a separate endpoint
//             }).catch(() => { });
//         }
//     }, [userRole]);

//     const applyPreset = (preset) => {
//         const { from, to } = getPresetDates(preset);
//         setDateFrom(from); setDateTo(to); setActivePreset(preset); setPage(1);
//     };
//     const resetFilters = () => {
//         setSearch(''); setTypeFilter('All'); setStatusFilter('All');
//         setDateFrom(''); setDateTo(''); setActivePreset(''); setSelectedAgent(''); setPage(1);
//     };
//     const hasFilters = search || typeFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo || selectedAgent;

//     const fetchCalls = useCallback(async (reset = false) => {
//         if (reset) setLoading(true);
//         setError(null);
//         try {
//             const params = { page: reset ? 1 : page, limit: 20, sortField, sortDir };
//             if (search.trim()) params.search = search.trim();
//             if (typeFilter !== 'All') params.callType = typeFilter;
//             if (statusFilter !== 'All') params.callStatus = statusFilter;
//             if (dateFrom.trim()) params.dateFrom = dateFrom;
//             if (dateTo.trim()) params.dateTo = dateTo;
//             if (selectedAgent.trim()) params.agentId = selectedAgent;

//             const response = await api.getCallLogs(params);
//             let logsData = [], pagData = { total: 0, pages: 1, page: 1 };
//             if (response?.logs && Array.isArray(response.logs)) {
//                 logsData = response.logs; pagData = response.pagination || pagData;
//             } else if (Array.isArray(response)) {
//                 logsData = response; pagData.total = response.length; pagData.pages = Math.ceil(response.length / 20);
//             }
//             setLogs(logsData);
//             setPagination(pagData);

//             try {
//                 const statsParams = {};
//                 if (search.trim()) statsParams.search = search.trim();
//                 if (typeFilter !== 'All') statsParams.callType = typeFilter;
//                 if (statusFilter !== 'All') statsParams.callStatus = statusFilter;
//                 if (dateFrom.trim()) statsParams.dateFrom = dateFrom;
//                 if (dateTo.trim()) statsParams.dateTo = dateTo;
//                 if (selectedAgent.trim()) statsParams.agentId = selectedAgent;
//                 const s = await api.getCallStats(statsParams);
//                 if (s?.success !== false) setStats(s);
//             } catch { }
//         } catch (err) {
//             setError(err.message || 'Network error.');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [search, typeFilter, statusFilter, dateFrom, dateTo, sortField, sortDir, selectedAgent, page]);

//     useEffect(() => { setPage(1); fetchCalls(true); }, [search, typeFilter, statusFilter, dateFrom, dateTo, sortField, sortDir, selectedAgent]);
//     useEffect(() => { if (page > 1) fetchCalls(false); }, [page]);

//     const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

//     const onDone = (msg) => {
//         setShowAdd(false); setShowImport(false); setEditLog(null); setDeleteLog(null);
//         showToast(msg);
//         setPage(1); fetchCalls(true);
//     };

//     const downloadCSV = () => {
//         if (!logs.length) return;
//         const headers = ['#', 'Agent', 'Customer', 'Phone', 'Type', 'Status', 'Duration', 'Date & Time', 'Disposition', 'Notes'];
//         const rows = logs.map((log, idx) => [
//             idx + 1, log.agent?.name || '—', log.customerName || '—', log.customerNumber || '—',
//             log.callType || '—', log.callStatus || '—',
//             fmtDuration(log.durationSeconds),
//             log.calledAt ? new Date(log.calledAt).toLocaleString('en-IN') : '—',
//             log.disposition || '—', (log.notes || '').replace(/,/g, ';'),
//         ]);
//         const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
//         const blob = new Blob([csv], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a'); a.href = url; a.download = 'call-logs.csv'; a.click();
//         URL.revokeObjectURL(url);
//     };

//     const statsItems = stats ? [
//         { label: 'Total', value: pagination.total, color: 'text-indigo-600' },
//         { label: 'Incoming', value: stats.incoming ?? stats.totalIncoming ?? 0, color: 'text-blue-600' },
//         { label: 'Outgoing', value: stats.outgoing ?? stats.totalOutgoing ?? 0, color: 'text-purple-600' },
//         { label: 'Connected', value: stats.connected ?? stats.totalConnected ?? 0, color: 'text-green-600' },
//         { label: 'Missed', value: stats.missed ?? stats.totalMissed ?? 0, color: 'text-red-600' },
//         { label: 'Today', value: stats.todayCalls ?? stats.today ?? 0, color: 'text-amber-600' },
//     ] : [];

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* Toast */}
//             {toast && (
//                 <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
//                     ✅ {toast}
//                 </div>
//             )}

//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
//                 <div>
//                     <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Call Logs</h2>
//                     <p className="text-xs text-gray-500">{pagination.total.toLocaleString()} records</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <button onClick={() => fetchCalls(true)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm">🔄</button>
//                     {canViewAll && <button onClick={downloadCSV} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm">⬇️</button>}
//                     {canAdd && (
//                         <>
//                             <button onClick={() => setShowImport(true)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm">📥</button>
//                             <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">+ Add</button>
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* Stats strip */}
//             {stats && (
//                 <div className="bg-white border-b border-gray-200 px-4 py-2 flex gap-1 overflow-x-auto">
//                     {statsItems.map(s => (
//                         <div key={s.label} className="flex flex-col items-center px-4 py-1.5 min-w-[60px]">
//                             <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
//                             <span className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Search */}
//             <div className="px-4 lg:px-6 py-3">
//                 <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm">
//                     <span className="text-sm">🔍</span>
//                     <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or number…" className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400" />
//                     {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>}
//                 </div>
//             </div>

//             {/* Filters */}
//             <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2 space-y-1.5">
//                 <div className="flex items-center gap-3 flex-wrap">
//                     <span className="text-xs font-bold text-gray-400 uppercase w-12">Type</span>
//                     <div className="flex gap-1.5 flex-wrap">
//                         {['All', 'Incoming', 'Outgoing'].map(t => (
//                             <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${typeFilter === t ? 'bg-indigo-50 text-indigo-700 font-bold' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{t}</button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3 flex-wrap">
//                     <span className="text-xs font-bold text-gray-400 uppercase w-12">Status</span>
//                     <div className="flex gap-1.5 flex-wrap">
//                         {['All', 'Connected', 'Missed', 'Rejected'].map(s => (
//                             <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-indigo-50 text-indigo-700 font-bold' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{s}</button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3 flex-wrap">
//                     <span className="text-xs font-bold text-gray-400 uppercase w-12">Range</span>
//                     <div className="flex gap-1.5 flex-wrap">
//                         {[{ key: 'today', label: 'Today' }, { key: 'yesterday', label: 'Yesterday' }, { key: 'last7', label: '7 Days' }, { key: 'last30', label: '30 Days' }].map(p => (
//                             <button key={p.key} onClick={() => applyPreset(p.key)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${activePreset === p.key ? 'bg-indigo-50 text-indigo-700 font-bold' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{p.label}</button>
//                         ))}
//                         {hasFilters && <button onClick={resetFilters} className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100">✕ Clear</button>}
//                     </div>
//                     <div className="flex items-center gap-2 ml-auto">
//                         <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 outline-none" />
//                         <span className="text-gray-400 text-xs">→</span>
//                         <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 outline-none" />
//                     </div>
//                 </div>
//             </div>

//             {/* Table / List */}
//             <div className="flex-1 overflow-y-auto">
//                 {loading ? (
//                     <div className="flex flex-col items-center justify-center h-full gap-3">
//                         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//                         <p className="text-sm text-gray-500">Loading call logs…</p>
//                     </div>
//                 ) : error && logs.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
//                         <span className="text-5xl">⚠️</span>
//                         <p className="text-lg font-bold text-gray-800">Failed to load</p>
//                         <p className="text-sm text-gray-500 text-center">{error}</p>
//                         <button onClick={() => fetchCalls(true)} className="px-6 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-full hover:bg-indigo-100">Try Again</button>
//                     </div>
//                 ) : logs.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
//                         <span className="text-5xl">📞</span>
//                         <p className="text-lg font-bold text-gray-800">No call logs found</p>
//                         {hasFilters && <button onClick={resetFilters} className="px-6 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-full hover:bg-indigo-100">Clear filters</button>}
//                     </div>
//                 ) : (
//                     <div className="hidden lg:block">
//                         <table className="w-full text-sm">
//                             <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                                 <tr>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Customer</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Type</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Disposition</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer" onClick={() => { setSortField('durationSeconds'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Duration {sortField === 'durationSeconds' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
//                                     <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer" onClick={() => { setSortField('calledAt'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Date {sortField === 'calledAt' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
//                                     {canViewAll && <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Agent</th>}
//                                     <th className="px-4 py-3"></th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {logs.map((log, idx) => (
//                                     <tr key={log._id || idx} className="bg-white hover:bg-gray-50 transition-colors">
//                                         <td className="px-4 py-3 font-semibold text-gray-900">{log.customerName || 'Unknown'}</td>
//                                         {/* <td className="px-4 py-3 text-gray-500">{log.customerNumber || '—'}</td> */}
//                                         <td className="px-4 py-3 text-gray-500">
//                                             <div className="flex items-center group">
//                                                 <span>{log.customerNumber || '—'}</span>
//                                                 {log.customerNumber && (
//                                                     <DialButton
//                                                         phone={log.customerNumber}
//                                                         name={log.customerName}
//                                                     />
//                                                 )}
//                                             </div>
//                                         </td>

//                                         <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TYPE_COLORS[log.callType] || 'bg-gray-100 text-gray-600'}`}>{log.callType || '—'}</span></td>
//                                         <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${STATUS_COLORS[log.callStatus] || 'bg-gray-100 text-gray-600'}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{log.callStatus}</span></td>
//                                         <td className="px-4 py-3">{log.disposition ? <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${DISP_COLORS[log.disposition] || 'bg-gray-100 text-gray-600'}`}>{log.disposition}</span> : <span className="text-gray-300">—</span>}</td>
//                                         <td className="px-4 py-3 text-gray-600 font-medium">{fmtDuration(log.durationSeconds)}</td>
//                                         <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(log.calledAt)}<br /><span className="text-gray-400">{fmtTime(log.calledAt)}</span></td>
//                                         {canViewAll && <td className="px-4 py-3 text-gray-500 text-xs">{log.agent?.name || '—'}</td>}
//                                         <td className="px-4 py-3">
//                                             <div className="flex items-center gap-1.5">
//                                                 <button onClick={() => setEditLog(log)} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100">Edit</button>
//                                                 {canDelete && <button onClick={() => setDeleteLog(log)} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100">Del</button>}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* Mobile cards */}
//                 {!loading && logs.length > 0 && (
//                     <div className="lg:hidden p-4 space-y-3">
//                         {logs.map((log, idx) => (
//                             <div key={log._id || idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
//                                 <div className="flex items-start justify-between mb-2">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: AV_COLORS[idx % AV_COLORS.length] }}>
//                                             {(log.customerName || 'U').charAt(0).toUpperCase()}
//                                         </div>
//                                         <div>
//                                             <p className="font-bold text-gray-900 text-sm">{log.customerName || 'Unknown'}</p>
//                                             <p className="text-xs text-gray-500">{log.customerNumber || '—'}</p>
//                                         </div>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="text-xs font-bold text-gray-600">{fmtDuration(log.durationSeconds)}</p>
//                                         <div className="flex gap-1 mt-1">
//                                             <button onClick={() => setEditLog(log)} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">Edit</button>
//                                             {canDelete && <button onClick={() => setDeleteLog(log)} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-bold">Del</button>}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <p className="text-xs text-gray-400 mb-2">{fmtDate(log.calledAt)} · {fmtTime(log.calledAt)}</p>
//                                 <div className="flex flex-wrap gap-1.5">
//                                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TYPE_COLORS[log.callType] || 'bg-gray-100 text-gray-600'}`}>{log.callType || '—'}</span>
//                                     <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[log.callStatus] || 'bg-gray-100 text-gray-600'}`}>{log.callStatus}</span>
//                                     {log.disposition && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${DISP_COLORS[log.disposition] || 'bg-gray-100 text-gray-600'}`}>{log.disposition}</span>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {pagination.pages > 1 && !loading && (
//                 <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
//                     <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">← Prev</button>
//                     <span className="text-sm text-gray-600 font-semibold">Page {page} of {pagination.pages}</span>
//                     <button disabled={page === pagination.pages} onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 disabled:opacity-40">Next →</button>
//                 </div>
//             )}

//             {/* Modals */}
//             <CallModal show={showAdd} onClose={() => setShowAdd(false)} onDone={onDone} />
//             <CallModal show={!!editLog} onClose={() => setEditLog(null)} onDone={onDone} log={editLog} />
//             <DeleteModal show={!!deleteLog} onClose={() => setDeleteLog(null)} onDone={onDone} log={deleteLog} />
//             <BulkImportModal show={showImport} onClose={() => setShowImport(false)} onDone={onDone} />
//         </div>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
    Phone, ArrowDownLeft, ArrowUpRight, Clock, Search, Filter,
    Download, RefreshCcw, ChevronLeft, ChevronRight, PhoneOff,
} from 'lucide-react';
import {
    Badge, Avatar, SearchInput, Select, Button, Card, LoadingPage,
    EmptyState, SectionHeader, StatCard,
} from '../components/UI';

const STATUS_CONFIG = {
    Connected: { variant: 'green', color: '#10B981', bg: '#ECFDF5' },
    Missed: { variant: 'red', color: '#F43F5E', bg: '#FFF1F2' },
    Rejected: { variant: 'yellow', color: '#F59E0B', bg: '#FFFBEB' },
    default: { variant: 'default', color: '#94A3B8', bg: '#F8FAFC' },
};

const fmtDuration = (sec) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60), s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
        ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function CallLogs({ role }) {
    const { user } = useContext(AuthContext);
    const effectiveRole = role || user?.role;

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [summary, setSummary] = useState(null);
    const LIMIT = 15;

    const isAdmin = effectiveRole === 'super_admin';
    const isBusiness = effectiveRole === 'business_user';

    useEffect(() => {
        if (isBusiness || isAdmin) {
            api.getMyTeam?.()
                .then(d => setAgents(d?.salespersons || d?.users || []))
                .catch(() => { });
        }
    }, []);

    const fetchLogs = async (p = 1) => {
        setLoading(true);
        try {
            const params = {
                page: p, limit: LIMIT,
                ...(search && { search }),
                ...(statusFilter && { callStatus: statusFilter }),
                ...(typeFilter && { callType: typeFilter }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
                ...(selectedAgent && { agentId: selectedAgent }),
            };
            const data = await api.getCallLogs(params);
            setLogs(data.logs || data.data || []);
            setTotalPages(data.totalPages || Math.ceil((data.total || 0) / LIMIT) || 1);
            setTotalLogs(data.total || data.totalLogs || 0);
            setSummary(data.summary || null);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { setPage(1); fetchLogs(1); }, [search, statusFilter, typeFilter, dateFrom, dateTo, selectedAgent]);

    const handleExport = async () => {
        try {
            const params = {
                ...(statusFilter && { callStatus: statusFilter }),
                ...(typeFilter && { callType: typeFilter }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo }),
                ...(selectedAgent && { agentId: selectedAgent }),
                format: 'csv',
            };
            await api.exportCallLogs(params);
        } catch (e) { alert('Export failed. Please try again.'); }
    };

    const resetFilters = () => {
        setSearch(''); setStatusFilter(''); setTypeFilter('');
        setDateFrom(''); setDateTo(''); setSelectedAgent(''); setPage(1);
    };

    const hasFilters = search || statusFilter || typeFilter || dateFrom || dateTo || selectedAgent;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Call Logs</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{totalLogs.toLocaleString()} total records</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" icon={RefreshCcw} onClick={() => fetchLogs(page)}>Refresh</Button>
                    <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>Export CSV</Button>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total" value={summary.total || 0} icon={Phone} color="#3B82F6" bgColor="#EFF6FF" />
                    <StatCard label="Connected" value={summary.connected || 0} icon={Phone} color="#10B981" bgColor="#ECFDF5" />
                    <StatCard label="Missed" value={summary.missed || 0} icon={PhoneOff} color="#F43F5E" bgColor="#FFF1F2" />
                    <StatCard label="Avg Duration" value={fmtDuration(summary.avgDuration)} icon={Clock} color="#8B5CF6" bgColor="#F5F3FF" />
                </div>
            )}

            {/* Filters */}
            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filters</span>
                    {hasFilters && (
                        <button onClick={resetFilters} className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700">
                            Clear all
                        </button>
                    )}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <SearchInput
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search number or name..."
                    />
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'All Statuses' },
                            { value: 'Connected', label: 'Connected' },
                            { value: 'Missed', label: 'Missed' },
                            { value: 'Rejected', label: 'Rejected' },
                        ]}
                    />
                    <Select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        options={[
                            { value: '', label: 'All Types' },
                            { value: 'Incoming', label: 'Incoming' },
                            { value: 'Outgoing', label: 'Outgoing' },
                            { value: 'Missed', label: 'Missed' },
                        ]}
                    />
                    {(isAdmin || isBusiness) && (
                        <Select
                            value={selectedAgent}
                            onChange={e => setSelectedAgent(e.target.value)}
                            options={[
                                { value: '', label: 'All Agents' },
                                ...agents.map(a => ({ value: a._id, label: a.name })),
                            ]}
                        />
                    )}
                </div>
                {/* Date range */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">From Date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To Date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>
            </Card>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <LoadingPage />
                ) : logs.length === 0 ? (
                    <EmptyState
                        icon={Phone}
                        title="No call logs found"
                        description="Try adjusting your search or filters to find records."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Duration</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                                        {(isAdmin || isBusiness) && (
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Agent</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {logs.map((log, i) => {
                                        const sc = STATUS_CONFIG[log.callStatus] || STATUS_CONFIG.default;
                                        const isIn = log.callType === 'Incoming';
                                        return (
                                            <tr key={log._id || i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sc.bg }}>
                                                            {isIn
                                                                ? <ArrowDownLeft size={14} style={{ color: sc.color }} />
                                                                : <ArrowUpRight size={14} style={{ color: sc.color }} />
                                                            }
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                                {log.customerName || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-slate-400 font-mono">{log.customerNumber || log.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={isIn ? 'cyan' : 'blue'}>{log.callType || '—'}</Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={sc.variant} dot>{log.callStatus || '—'}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">
                                                    {fmtDuration(log.durationSeconds || log.duration)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap">
                                                    {fmtDateTime(log.calledAt || log.startTime)}
                                                </td>
                                                {(isAdmin || isBusiness) && (
                                                    <td className="px-4 py-3 hidden lg:table-cell">
                                                        {log.agent ? (
                                                            <div className="flex items-center gap-2">
                                                                <Avatar name={log.agent.name} size="xs" />
                                                                <span className="text-sm text-slate-600">{log.agent.name}</span>
                                                            </div>
                                                        ) : <span className="text-slate-400 text-sm">—</span>}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400">
                                    Page {page} of {totalPages} · {totalLogs} total records
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => { setPage(p => p - 1); fetchLogs(page - 1); }}
                                        disabled={page <= 1}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                        return (
                                            <button
                                                key={pg}
                                                onClick={() => { setPage(pg); fetchLogs(pg); }}
                                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${pg === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {pg}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => { setPage(p => p + 1); fetchLogs(page + 1); }}
                                        disabled={page >= totalPages}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
