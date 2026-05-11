// ╔══════════════════════════════════════════════════════════════════╗
// ║  FILE: frontend/src/pages/salesperson/MyLeads.jsx  (NEW FILE)     ║
// ╚══════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';

const STATUS_STYLES = {
  "Fresh Lead":     "bg-blue-100 text-blue-700 border border-blue-200",   // ✅ NAYA
  "Interested":     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Not Interested": "bg-red-100 text-red-700 border border-red-200",
  "DNP":            "bg-amber-100 text-amber-700 border border-amber-200",

};

const STATUSES = ["Fresh Lead", 'Interested', 'Not Interested', 'DNP'];

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

export default function SalespersonLeads() {
  const [leads,   setLeads]   = useState([]);
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);

  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate,   setToDate]   = useState('');

  // Follow-up modal
  const [followupLead,   setFollowupLead]   = useState(null);
  const [followupForm,   setFollowupForm]   = useState({ description: '', followUpDate: '', status: '' });
  const [followupSaving, setFollowupSaving] = useState(false);

  // History modal
  const [historyLead, setHistoryLead] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getLeads({ status: filter, search, fromDate, toDate, page, limit: 30 });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load leads', 'error'); }
    finally { setLoading(false); }
  }, [filter, search, fromDate, toDate, page]);

  const fetchStats = useCallback(async () => {
    try { const s = await api.getLeadStats(); setStats(s); } catch {}
  }, []);

  useEffect(() => { fetchLeads(); fetchStats(); }, [fetchLeads, fetchStats]);

  // Quick status change from table dropdown
  const handleStatusChange = async (lead, newStatus) => {
    try {
      await api.updateLead(lead._id, { status: newStatus });
      showToast('Status updated');
      fetchLeads(); fetchStats();
    } catch { showToast('Failed to update status', 'error'); }
  };

  // Follow-up submit
  const handleFollowupSubmit = async () => {
    if (!followupForm.description.trim()) return showToast('Please enter a description', 'error');
    setFollowupSaving(true);
    try {
      await api.addFollowUp(followupLead._id, {
        description:  followupForm.description,
        followUpDate: followupForm.followUpDate || undefined,
        status:       followupForm.status || undefined,
      });
      showToast('Follow-up saved');
      setFollowupLead(null);
      setFollowupForm({ description: '', followUpDate: '', status: '' });
      fetchLeads(); fetchStats();
    } catch { showToast('Failed to save follow-up', 'error'); }
    finally { setFollowupSaving(false); }
  };

  const openFollowup = (lead) => {
    setFollowupLead(lead);
    setFollowupForm({ description: lead.followUpDescription || '', followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : '', status: lead.status });
  };

  const openHistory = async (lead) => {
    try {
      const full = await api.getLeadById(lead._id);
      setHistoryLead(full);
    } catch { showToast('Failed to load history', 'error'); }
  };

  const isPendingFollowup = (lead) =>
    lead.followUpDate && new Date(lead.followUpDate) <= new Date() && lead.status === 'Interested';

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Leads</h1>
        <p className="text-sm text-gray-500 mt-0.5">Call leads, update status, add follow-up notes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',              value: stats.total           || 0, color: 'text-gray-900',    bg: 'bg-gray-50',    border: 'border-gray-200' },
          { label: 'Interested',         value: stats.interested      || 0, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Not Interested',     value: stats.notInterested   || 0, color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
          { label: 'Pending Follow-ups', value: stats.pendingFollowups|| 0, color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Customer', 'Mobile', 'Course', 'Status', 'Follow-up Notes', 'Next Follow-up', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No leads assigned</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} className={`hover:bg-gray-50 transition-colors ${isPendingFollowup(lead) ? 'bg-amber-50/40' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {lead.customerName}
                    {isPendingFollowup(lead) && <span className="ml-1.5 text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full">Follow-up Due</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 group">
                      <a href={`tel:${lead.mobileNumber}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        📞 {lead.mobileNumber}
                      </a>
                      <DialButton phone={lead.mobileNumber} name={lead.customerName} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[110px] truncate">{lead.courseName || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={lead.status}
                      onChange={e => handleStatusChange(lead, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${STATUS_STYLES[lead.status]}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{lead.followUpDescription || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openFollowup(lead)}
                        className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        + Follow-up
                      </button>
                      <button onClick={() => openHistory(lead)}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 30 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing {leads.length} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={leads.length < 30}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Follow-up Modal ─────────────────────────────────── */}
      {followupLead && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add Follow-up</h2>
                <p className="text-xs text-gray-500 mt-0.5">{followupLead.customerName} · {followupLead.mobileNumber}</p>
              </div>
              <button onClick={() => setFollowupLead(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select value={followupForm.status} onChange={e => setFollowupForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Follow-up Notes *</label>
                <textarea value={followupForm.description} onChange={e => setFollowupForm(p => ({ ...p, description: e.target.value }))}
                  rows={4} placeholder="What happened on this call? Next steps?"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Next Follow-up Date</label>
                <input type="date" value={followupForm.followUpDate} onChange={e => setFollowupForm(p => ({ ...p, followUpDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setFollowupLead(null)}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleFollowupSubmit} disabled={followupSaving}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
                  {followupSaving ? 'Saving…' : 'Save Follow-up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── History Modal ───────────────────────────────────── */}
      {historyLead && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Follow-up History</h2>
                <p className="text-xs text-gray-500">{historyLead.customerName} · {historyLead.mobileNumber}</p>
              </div>
              <button onClick={() => setHistoryLead(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="px-6 py-4">
              {(!historyLead.followUpHistory || historyLead.followUpHistory.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-8">No follow-up history yet</p>
              ) : (
                <div className="space-y-3">
                  {[...historyLead.followUpHistory].reverse().map((h, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800">{h.description}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                          {new Date(h.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {h.followUpDate && (
                        <p className="text-xs text-indigo-600 mt-1.5">📅 Next: {new Date(h.followUpDate).toLocaleDateString('en-IN')}</p>
                      )}
                      {h.updatedBy?.name && <p className="text-xs text-gray-400 mt-1">By: {h.updatedBy.name}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
