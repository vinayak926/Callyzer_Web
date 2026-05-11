import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
 
const STATUS_STYLES = {
  'Interested':     'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'Not Interested': 'bg-red-100 text-red-700 border border-red-200',
  'DNP':            'bg-amber-100 text-amber-700 border border-amber-200',
  'Fresh Lead':     'bg-blue-100 text-blue-700 border border-blue-200',
};
 
export default function WorkedLeads() {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [team,    setTeam]    = useState([]);
 
  const [salespersonId, setSalespersonId] = useState('');
  const [status,        setStatus]        = useState('');
  const [fromDate,      setFromDate]      = useState('');
  const [toDate,        setToDate]        = useState('');
  const [historyLead,   setHistoryLead]   = useState(null);
  const [toast,         setToast]         = useState(null);
 
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
 
  // Team fetch
  useEffect(() => {
    // api.getTeamMembers().then(d => setTeam(d.salespersons || d || [])).catch(() => {});
    api.getMyTeam().then(d => setTeam(d.salespersons || [])).catch(() => {});
  }, []);
 
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getWorkedLeads({
        salespersonId, status, fromDate, toDate, page, limit: 30
      });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }, [salespersonId, status, fromDate, toDate, page]);
 
  useEffect(() => { fetchLeads(); }, [fetchLeads]);
 
  const openHistory = async (lead) => {
    try { const full = await api.getLeadById(lead._id); setHistoryLead(full); }
    catch { showToast('Failed to load history', 'error'); }
  };
 
  return (
    <div className='p-4 lg:p-6 space-y-5'>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.msg}
        </div>
      )}
 
      {/* Header */}
      <div>
        <h1 className='text-xl font-bold text-gray-900'>Salesperson Activity</h1>
        <p className='text-sm text-gray-500 mt-0.5'>
          Track which salesperson worked on which lead and what they updated
        </p>
      </div>
 
      {/* Filters */}
      <div className='bg-white rounded-xl border border-gray-200 p-4'>
        <div className='flex flex-wrap gap-3'>
          <select value={salespersonId} onChange={e => { setSalespersonId(e.target.value); setPage(1); }}
            className='px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'>
            <option value=''>All Salespersons</option>
            {team.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className='px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300'>
            <option value=''>All Status</option>
            {['Interested', 'Not Interested', 'DNP'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input type='date' value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }}
            className='px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300' />
          <input type='date' value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }}
            className='px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300' />
          {(salespersonId || status || fromDate || toDate) && (
            <button onClick={() => { setSalespersonId(''); setStatus(''); setFromDate(''); setToDate(''); }}
              className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700'>Clear</button>
          )}
        </div>
      </div>
 
      {/* Table */}
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                {['Customer', 'Mobile', 'Course', 'Salesperson', 'Status', 'Last Notes', 'Updated On', 'History'].map(h => (
                  <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                <tr><td colSpan={8} className='text-center py-10 text-gray-400'>Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={8} className='text-center py-10 text-gray-400'>No worked leads found</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-4 py-3 font-medium text-gray-900 whitespace-nowrap'>{lead.customerName}</td>
                  <td className='px-4 py-3 text-gray-600 whitespace-nowrap'>{lead.mobileNumber}</td>
                  <td className='px-4 py-3 text-gray-600 max-w-[110px] truncate'>{lead.courseName || '—'}</td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600'>
                        {lead.assignedTo?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className='text-sm text-gray-700'>{lead.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[lead.status] || ''}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-gray-600 max-w-[180px] truncate'>{lead.followUpDescription || '—'}</td>
                  <td className='px-4 py-3 text-gray-500 whitespace-nowrap text-xs'>
                    {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className='px-4 py-3'>
                    <button onClick={() => openHistory(lead)}
                      className='px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'>
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {total > 30 && (
          <div className='flex items-center justify-between px-4 py-3 border-t border-gray-100'>
            <p className='text-xs text-gray-500'>Showing {leads.length} of {total}</p>
            <div className='flex gap-2'>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50'>Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={leads.length < 30}
                className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50'>Next</button>
            </div>
          </div>
        )}
      </div>
 
      {/* History Modal */}
      {historyLead && (
        <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white'>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Follow-up History</h2>
                <p className='text-xs text-gray-500'>{historyLead.customerName} · {historyLead.mobileNumber}</p>
              </div>
              <button onClick={() => setHistoryLead(null)} className='text-gray-400 hover:text-gray-600 text-xl'>x</button>
            </div>
            <div className='px-6 py-4'>
              {(!historyLead.followUpHistory || historyLead.followUpHistory.length === 0) ? (
                <p className='text-sm text-gray-400 text-center py-8'>No follow-up history yet</p>
              ) : (
                <div className='space-y-3'>
                  {[...historyLead.followUpHistory].reverse().map((h, i) => (
                    <div key={i} className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className='text-sm font-medium text-gray-800'>{h.description}</p>
                        <span className='text-xs text-gray-400 whitespace-nowrap shrink-0'>
                          {new Date(h.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      {h.followUpDate && (
                        <p className='text-xs text-indigo-600 mt-1.5'>Next: {new Date(h.followUpDate).toLocaleDateString('en-IN')}</p>
                      )}
                      {h.updatedBy?.name && <p className='text-xs text-gray-400 mt-1'>By: {h.updatedBy.name}</p>}
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
