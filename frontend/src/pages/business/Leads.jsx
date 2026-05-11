// ╔══════════════════════════════════════════════════════════════╗
// ║  FILE: frontend/src/pages/business/Leads.jsx  (NEW FILE)    ║
// ╚══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../services/api';

// ── Status badge colours ──────────────────────────────────────
const STATUS_STYLES = {
  "Fresh Lead":     "bg-blue-100 text-blue-700 border border-blue-200",   // ✅ NAYA
  "Interested":     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Not Interested": "bg-red-100 text-red-700 border border-red-200",
  "DNP":            "bg-amber-100 text-amber-700 border border-amber-200",

};

// const STATUSES = ['Interested', 'Not Interested', 'DNP'];
const STATUSES = ["Fresh Lead", "Interested", "Not Interested", "DNP"];

// ── Empty form state ──────────────────────────────────────────
// const EMPTY_FORM = {
//   customerName: '', mobileNumber: '', courseName: '',
//   leadSource: '', status: 'Interested',
//   followUpDescription: '', followUpDate: '',
// };

const EMPTY_FORM = {
  customerName: "",
  mobileNumber: "",
  courseName:   "",
  leadSource:   "",
  assignedTo: "",
};

// ✅ NAYA — yeh poora component add karo MyLeads.jsx mein (line ~17 ke baad, STATUS_STYLES ke neeche)

function DialButton({ phone, name }) {
  const [state, setState] = React.useState('idle');
  const [msg,   setMsg  ] = React.useState('');

  const handleDial = async (e) => {
    e.stopPropagation();
    if (state === 'dialing') return;
    setState('dialing');
    try {
      window.postMessage({
        type:  'CALLYZER_DIAL',
        phone,
        name:  name || 'Unknown',
        token: localStorage.getItem('token'),
      }, '*');
      const res = await api.triggerDial(phone, name);
      if (res.success) {
        setState('sent');
        setMsg(res.socketSent ? 'Sent to mobile' : 'Open mobile app');
      } else {
        setState('error');
        setMsg(res.message || 'Failed');
      }
    } catch {
      setState('error');
      setMsg('Connection error');
    }
    setTimeout(() => { setState('idle'); setMsg(''); }, 3000);
  };

  const cfg = {
    idle:    { cls: 'bg-green-50 hover:bg-green-100 text-green-600',  icon: '☎' },
    dialing: { cls: 'bg-yellow-50 text-yellow-600',                   icon: '...' },
    sent:    { cls: 'bg-blue-50 text-blue-600',                       icon: '✓' },
    error:   { cls: 'bg-red-50 text-red-600',                         icon: '✕' },
  }[state];

  return (
    <div className="relative inline-flex items-center">
      <button onClick={handleDial}
        title={`Call ${phone} on mobile app`}
        className={`opacity-0 group-hover:opacity-100 transition-all duration-150
          ${cfg.cls} w-7 h-7 rounded-lg flex items-center justify-center
          text-xs border border-current border-opacity-20
          ${state === 'dialing' ? 'cursor-wait' : 'cursor-pointer'}`}>
        {cfg.icon}
      </button>
      {msg && (
        <span className={`absolute left-10 top-0 whitespace-nowrap text-xs
          font-semibold px-2 py-1 rounded-md shadow-sm z-10 ${cfg.cls}
          border border-current border-opacity-20`}>
          {msg}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
export default function BusinessLeads() {
  const [leads,    setLeads]    = useState([]);
  const [stats,    setStats]    = useState({});
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);

  // Filters
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate,   setToDate]   = useState('');

  // Modals
  const [showAdd,    setShowAdd]    = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editLead,   setEditLead]   = useState(null);

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  // CSV/Excel import state
  const [importRows,    setImportRows]    = useState([]);
  const [importType,    setImportType]    = useState('csv');
  const [importLoading, setImportLoading] = useState(false);
  const fileRef = useRef();

  const [salespersons, setSalespersons] = useState([]);

  // ── Data fetching ─────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getLeads({ status: filter, search, fromDate, toDate, page, limit: 30 });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load leads', 'error'); }
    finally  { setLoading(false); }
  }, [filter, search, fromDate, toDate, page]);

  const fetchStats = useCallback(async () => {
    try { const s = await api.getLeadStats(); setStats(s); } catch {}
  }, []);

  useEffect(() => { fetchLeads(); fetchStats(); }, [fetchLeads, fetchStats]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await api.getMyTeam();  // ← SAHI NAAM
        setSalespersons(data.salespersons || []);
      } catch {}
    };
    fetchTeam();
  }, []);

  // ── Manual add / edit submit ──────────────────────────────
  const handleSubmit = async () => {
    if (!form.customerName.trim() || !form.mobileNumber.trim()) {
      return showToast('Customer name and mobile number are required', 'error');
    }
    setSaving(true);
    try {
      if (editLead) {
        await api.updateLead(editLead._id, form);
        showToast('Lead updated');
      } else {
        await api.createLead(form);
        showToast('Lead created');
      }
      setShowAdd(false); setEditLead(null); setForm(EMPTY_FORM);
      fetchLeads(); fetchStats();
    } catch { showToast('Failed to save lead', 'error'); }
    finally { setSaving(false); }
  };

  const openEdit = (lead) => {
    setForm({
      customerName: lead.customerName, mobileNumber: lead.mobileNumber,
      courseName: lead.courseName, leadSource: lead.leadSource,
      status: lead.status, followUpDescription: lead.followUpDescription,
      followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : '',
    });
    setEditLead(lead); setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.deleteLead(id);
      showToast('Lead deleted');
      fetchLeads(); fetchStats();
    } catch { showToast('Failed to delete', 'error'); }
  };

  // ── File import ───────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isCsv   = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!isCsv && !isExcel) return showToast('Only CSV or Excel files allowed', 'error');

    setImportType(isExcel ? 'excel' : 'csv');

    const text = await file.text();
    // Parse CSV-like (works for basic Excel saved as CSV; for .xlsx we need SheetJS on client or server)
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());

    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
      const obj  = {};
      headers.forEach((h, i) => { obj[h] = cols[i] || ''; });
      return {
        customerName:        obj['customer name']  || obj['customername']  || obj['name'] || '',
        mobileNumber:        obj['mobile number']  || obj['mobilenumber']  || obj['mobile'] || obj['phone'] || '',
        courseName:          obj['course name']    || obj['coursename']    || obj['course'] || obj['product'] || '',
        leadSource:          obj['lead source']    || obj['leadsource']    || obj['source'] || '',
        status:              STATUSES.includes(obj['status']) ? obj['status'] : 'Interested',
        followUpDescription: obj['follow-up description'] || obj['notes'] || obj['description'] || '',
        followUpDate:        obj['follow-up date'] || obj['followupdate'] || '',
      };
    }).filter(r => r.customerName && r.mobileNumber);

    setImportRows(rows);
  };

  const handleImportSubmit = async () => {
    if (!importRows.length) return showToast('No valid rows found', 'error');
    setImportLoading(true);
    try {
      const res = await api.importLeads(importRows, importType);
      showToast(`${res.imported} leads imported${res.skipped ? `, ${res.skipped} skipped` : ''}`);
      setShowImport(false); setImportRows([]); fetchLeads(); fetchStats();
    } catch { showToast('Import failed', 'error'); }
    finally { setImportLoading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const downloadTemplate = () => {
    const csv = `Customer Name,Mobile Number,Course Name,Lead Source,Status,Follow-up Description,Follow-up Date\nJohn Doe,9876543210,MBA Course,Facebook,Interested,Very interested follow up soon,2024-02-15`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'leads_template.csv'; a.click();
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all your sales leads</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setShowImport(true); setImportRows([]); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
            📤 Import CSV/Excel
          </button>
          <button onClick={() => { setShowAdd(true); setEditLead(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            ＋ Add Lead
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
            { label: "Total",          value: stats.total       || 0, color: "text-gray-900",    bg: "bg-gray-50",    border: "border-gray-200" },
            { label: "Fresh Leads",    value: stats.freshLeads  || 0, color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },  // ✅ NAYA
            { label: "Interested",     value: stats.interested  || 0, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Not Interested", value: stats.notInterested || 0, color: "text-red-700",   bg: "bg-red-50",     border: "border-red-200" },

        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name / number / course…"
            className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          {(search || filter || fromDate || toDate) && (
            <button onClick={() => { setSearch(''); setFilter(''); setFromDate(''); setToDate(''); setPage(1); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Customer', 'Mobile', 'Course', 'Source', 'Status', 'Follow-up', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No leads found</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{lead.customerName}</td>
                  {/* <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <a href={`tel:${lead.mobileNumber}`} className="flex items-center gap-1 text-indigo-600 hover:underline font-medium">
                      📞 {lead.mobileNumber}
                    </a>
                  </td> */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-2 group">
                      <a href={`tel:${lead.mobileNumber}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        📞 {lead.mobileNumber}
                      </a>
                      <DialButton phone={lead.mobileNumber} name={lead.customerName} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{lead.courseName || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{lead.leadSource || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{lead.followUpDescription || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(lead)}
                        className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">Edit</button>
                      <button onClick={() => handleDelete(lead._id)}
                        className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 30 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {leads.length} of {total} leads</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={leads.length < 30}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={() => { setShowAdd(false); setEditLead(null); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Customer Name *', key: 'customerName', placeholder: 'Full name' },
                { label: 'Mobile Number *', key: 'mobileNumber', placeholder: '10-digit mobile' },
                { label: 'Course / Product', key: 'courseName',  placeholder: 'e.g. MBA, Web Dev' },
                { label: 'Lead Source',      key: 'leadSource',  placeholder: 'e.g. Facebook, Referral' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Assign To (Optional)</label>
                <select value={form.assignedTo || ""} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg ...">
                  <option value="">-- Unassigned --</option>
                  {salespersons.map(sp => (
                    <option key={sp._id} value={sp._id}>{sp.name}</option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Follow-up Notes</label>
                <textarea value={form.followUpDescription} onChange={e => setForm(p => ({ ...p, followUpDescription: e.target.value }))}
                  rows={3} placeholder="Add notes about the lead…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Follow-up Date</label>
                <input type="date" value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div> */}

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAdd(false); setEditLead(null); }}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                  {saving ? 'Saving…' : editLead ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Modal ───────────────────────────────────── */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Import Leads</h2>
              <button onClick={() => { setShowImport(false); setImportRows([]); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Template download */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-800 mb-1">📋 Download CSV Template</p>
                <p className="text-xs text-indigo-600 mb-3">Use our template for the correct column format.</p>
                <button onClick={downloadTemplate}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  Download Template
                </button>
              </div>

              {/* File input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Upload CSV or Excel File</label>
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-200 rounded-lg p-2" />
              </div>

              {/* Preview */}
              {importRows.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-emerald-800 mb-1">✅ {importRows.length} leads ready to import</p>
                  <div className="overflow-x-auto mt-2 max-h-40">
                    <table className="text-xs w-full">
                      <thead><tr className="text-left text-gray-500">
                        {['Name', 'Mobile', 'Course', 'Status'].map(h => <th key={h} className="py-1 pr-3">{h}</th>)}
                      </tr></thead>
                      <tbody>{importRows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-t border-emerald-100">
                          <td className="py-1 pr-3 font-medium">{r.customerName}</td>
                          <td className="py-1 pr-3">{r.mobileNumber}</td>
                          <td className="py-1 pr-3">{r.courseName || '—'}</td>
                          <td className="py-1 pr-3">{r.status}</td>
                        </tr>
                      ))}
                      {importRows.length > 5 && <tr><td colSpan={4} className="py-1 text-gray-400">…and {importRows.length - 5} more</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setShowImport(false); setImportRows([]); }}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleImportSubmit} disabled={importLoading || importRows.length === 0}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                  {importLoading ? 'Importing…' : `Import ${importRows.length} Leads`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
