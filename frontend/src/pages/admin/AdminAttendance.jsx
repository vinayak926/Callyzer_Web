import { useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_CONFIG = {
    present: { label: 'Present', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    absent: { label: 'Absent', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
    half_day: { label: 'Half Day', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    work_from_home: { label: 'WFH', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' },
    holiday: { label: 'Holiday', color: 'bg-purple-100 text-purple-600', dot: 'bg-purple-500' },
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const fmtTime = (isoStr) => {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const fmtHours = (h) => {
    if (!h) return '—';
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
};

// ── Stat Mini Card ─────────────────────────────────────────────
const MiniStat = ({ label, value, color, dot }) => (
    <div className={`rounded-xl p-3 border ${color.includes('emerald') ? 'bg-emerald-50 border-emerald-100' :
        color.includes('red') ? 'bg-red-50 border-red-100' :
            color.includes('amber') ? 'bg-amber-50 border-amber-100' :
                color.includes('blue') ? 'bg-blue-50 border-blue-100' :
                    'bg-purple-50 border-purple-100'} text-center`}>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <p className={`text-xs font-medium ${color.split(' ')[1]}`}>{label}</p>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────
const AdminAttendance = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loadingEmps, setLoadingEmps] = useState(true);
    const [loadingAtt, setLoadingAtt] = useState(false);
    const [empSearch, setEmpSearch] = useState('');
    const [toast, setToast] = useState('');

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    // Load employees
    useEffect(() => {
        const fetchEmps = async () => {
            try {
                const res = await fetch(`${API}/hr/employees?limit=200`, { headers });
                const data = await res.json();
                const emps = data.employees || [];
                setEmployees(emps);
                if (emps.length) setSelectedEmp(emps[0]);
            } catch {
                showToast('❌ Failed to load employees');
            } finally {
                setLoadingEmps(false);
            }
        };
        fetchEmps();
    }, []);

    // Load attendance
    const fetchAttendance = useCallback(async () => {
        if (!selectedEmp) return;
        setLoadingAtt(true);
        try {
            const mm = String(month).padStart(2, '0');
            const res = await fetch(`${API}/attendance/all?month=${year}-${mm}`, { headers });
            const data = await res.json();
            const empRecords = (data.records || []).filter(
                (r) => (r.employee?._id || r.employee) === selectedEmp._id
            );
            setAttendance(empRecords);
        } catch {
            showToast('❌ Failed to load attendance');
        } finally {
            setLoadingAtt(false);
        }
    }, [selectedEmp, month, year]);

    useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

    const summary = {
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        half_day: attendance.filter(a => a.status === 'half_day').length,
        work_from_home: attendance.filter(a => a.status === 'work_from_home').length,
        holiday: attendance.filter(a => a.status === 'holiday').length,
    };

    const filteredEmps = employees.filter(e =>
        e.name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        e.role?.toLowerCase().includes(empSearch.toLowerCase())
    );

    const totalHours = attendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
    const avgHours = attendance.length ? (totalHours / attendance.length).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
                    {toast}
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-7 bg-blue-600 rounded-full" />
                        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
                    </div>
                    <p className="text-gray-500 text-sm pl-3">View employee punch-in / punch-out history</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={month}
                        onChange={e => setMonth(Number(e.target.value))}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white font-medium text-gray-700"
                    >
                        {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white font-medium text-gray-700"
                    >
                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    
                    <button
                        onClick={async () => {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API}/attendance/export?month=${year}-${String(month).padStart(2, '0')}${selectedEmp ? `&employeeId=${selectedEmp._id}` : ''}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `attendance-${year}-${month}.csv`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm"
                    >
                        📥 Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                {/* ── Employee Sidebar ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden" style={{ maxHeight: '680px' }}>
                    <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Employee</p>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={empSearch}
                                onChange={e => setEmpSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {loadingEmps ? (
                            <div className="flex justify-center py-10">
                                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filteredEmps.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-8">No employees found</p>
                        ) : (
                            filteredEmps.map((emp) => (
                                <button
                                    key={emp._id}
                                    onClick={() => setSelectedEmp(emp)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${selectedEmp?._id === emp._id
                                        ? 'bg-blue-600 shadow-md'
                                        : 'hover:bg-gray-50'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${selectedEmp?._id === emp._id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'}`}>
                                        {emp.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-semibold truncate ${selectedEmp?._id === emp._id ? 'text-white' : 'text-gray-800'}`}>
                                            {emp.name}
                                        </p>
                                        <p className={`text-xs capitalize truncate ${selectedEmp?._id === emp._id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {emp.role?.replace('_', ' ')}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Attendance Content ── */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Selected Employee Banner */}
                    {selectedEmp && (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                                    {selectedEmp.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base">{selectedEmp.name}</p>
                                    <p className="text-blue-100 text-xs capitalize">{selectedEmp.role?.replace('_', ' ')} — {MONTHS[month - 1]} {year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <div>
                                    <p className="text-white font-bold text-xl">{attendance.length}</p>
                                    <p className="text-blue-200 text-xs">Total Records</p>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div>
                                    <p className="text-white font-bold text-xl">{fmtHours(totalHours)}</p>
                                    <p className="text-blue-200 text-xs">Total Hours</p>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div>
                                    <p className="text-white font-bold text-xl">{avgHours}h</p>
                                    <p className="text-blue-200 text-xs">Avg / Day</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <MiniStat key={key} label={cfg.label} value={summary[key] || 0} color={cfg.color} dot={cfg.dot} />
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-700">
                                Daily Records
                                {!loadingAtt && <span className="ml-2 text-xs font-normal text-gray-400">({attendance.length} days)</span>}
                            </h2>
                            <button onClick={fetchAttendance} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {loadingAtt ? (
                            <div className="flex flex-col justify-center items-center py-16 gap-3">
                                <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-400">Loading attendance...</p>
                            </div>
                        ) : attendance.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-500">No records for this month</p>
                                <p className="text-xs text-gray-300 mt-1">Records appear when employee punches in</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/70">
                                            {['Date', 'Status', 'Punch In', 'Punch Out', 'Hours Worked', 'In Location', 'Out Location'].map(h => (
                                                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {attendance.map((att) => (
                                            <tr key={att._id} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                                                    {att.date}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[att.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                                                        {STATUS_CONFIG[att.status]?.label || att.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-sm font-medium ${att.punchIn?.time ? 'text-emerald-600' : 'text-gray-300'}`}>
                                                        {fmtTime(att.punchIn?.time)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-sm font-medium ${att.punchOut?.time ? 'text-red-500' : 'text-gray-300'}`}>
                                                        {fmtTime(att.punchOut?.time)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                        {fmtHours(att.hoursWorked)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {att.punchIn?.location?.latitude ? (
                                                        <a
                                                            href={`https://maps.google.com/?q=${att.punchIn.location.latitude},${att.punchIn.location.longitude}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium border border-blue-200 bg-blue-50 rounded-lg px-2 py-1 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            Map
                                                        </a>
                                                    ) : <span className="text-gray-300 text-sm">—</span>}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {att.punchOut?.location?.latitude ? (
                                                        <a
                                                            href={`https://maps.google.com/?q=${att.punchOut.location.latitude},${att.punchOut.location.longitude}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium border border-blue-200 bg-blue-50 rounded-lg px-2 py-1 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            Map
                                                        </a>
                                                    ) : <span className="text-gray-300 text-sm">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendance;