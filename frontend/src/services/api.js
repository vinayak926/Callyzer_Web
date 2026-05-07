// src/services/api.js
import { API_BASE_URL } from '../config';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});

export const api = {
    // ── AUTH ──────────────────────────────────────────────
    login: async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    register: async (data) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    forgotPassword: async (email) => {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.json();
    },

    // ── ADMIN STATS ───────────────────────────────────────
    getAdminStats: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: authHeaders() });
        return res.json();
    },

    getAdminRecentUsers: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/recent-users`, { headers: authHeaders() });
        return res.json();
    },

    // ── ADMIN USERS ───────────────────────────────────────
    getUsers: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.search) query.append('search', params.search);
        if (params.role && params.role !== 'All') query.append('role', params.role);
        if (params.page) query.append('page', params.page);
        const res = await fetch(`${API_BASE_URL}/admin/users?${query}`, { headers: authHeaders() });
        return res.json();
    },

    createUser: async (data) => {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    updateUser: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    deleteUser: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'DELETE', headers: authHeaders(),
        });
        return res.json();
    },

    // ── ADMIN APPROVALS ───────────────────────────────────
    getPendingApprovals: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/pending-approvals`, { headers: authHeaders() });
        return res.json();
    },

    approveUser: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/approve`, {
            method: 'PATCH', headers: authHeaders(),
        });
        return res.json();
    },

    rejectUser: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/reject`, {
            method: 'PATCH', headers: authHeaders(),
        });
        return res.json();
    },

    toggleUserStatus: async (id) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/toggle-status`, {
            method: 'PATCH', headers: authHeaders(),
        });
        return res.json();
    },

    resetUserPassword: async (id, newPassword) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${id}/reset-password`, {
            method: 'PATCH', headers: authHeaders(),
            body: JSON.stringify({ newPassword }),
        });
        return res.json();
    },

    // ── ADMIN SETTINGS ────────────────────────────────────
    getSettings: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers: authHeaders() });
        return res.json();
    },

    updateSettings: async (data) => {
        const res = await fetch(`${API_BASE_URL}/admin/settings`, {
            method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    // ── CALL LOGS ─────────────────────────────────────────
    getCallLogs: async (params = {}) => {
        const q = new URLSearchParams();
        q.append('page', params.page || 1);
        q.append('limit', params.limit || 20);
        q.append('sortField', params.sortField || 'calledAt');
        q.append('sortDir', params.sortDir || 'desc');
        if (params.search?.trim()) q.append('search', params.search.trim());
        if (params.callType && params.callType !== 'All') q.append('callType', params.callType);
        if (params.callStatus && params.callStatus !== 'All') q.append('callStatus', params.callStatus);
        if (params.dateFrom?.trim()) q.append('dateFrom', params.dateFrom);
        if (params.dateTo?.trim()) q.append('dateTo', params.dateTo);
        if (params.agentId?.trim()) q.append('agentId', params.agentId);
        const res = await fetch(`${API_BASE_URL}/calls?${q.toString()}`, { headers: authHeaders() });
        return res.json();
    },

    getCallStats: async (params = {}) => {
        const q = new URLSearchParams();
        if (params.callType) q.append('callType', params.callType);
        if (params.callStatus) q.append('callStatus', params.callStatus);
        if (params.dateFrom) q.append('dateFrom', params.dateFrom);
        if (params.dateTo) q.append('dateTo', params.dateTo);
        if (params.agentId) q.append('agentId', params.agentId);
        if (params.search) q.append('search', params.search);
        const res = await fetch(`${API_BASE_URL}/calls/stats${q.toString() ? '?' + q : ''}`, { headers: authHeaders() });
        return res.json();
    },

    createCallLog: async (data) => {
        const res = await fetch(`${API_BASE_URL}/calls`, {
            method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    updateCallLog: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/calls/${id}`, {
            method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    deleteCallLog: async (id) => {
        const res = await fetch(`${API_BASE_URL}/calls/${id}`, {
            method: 'DELETE', headers: authHeaders(),
        });
        return res.json();
    },

    getPendingFollowUps: async () => {
        const res = await fetch(`${API_BASE_URL}/calls/follow-ups`, { headers: authHeaders() });
        return res.json();
    },

    bulkCreateCallLogs: async (calls) => {
        const res = await fetch(`${API_BASE_URL}/calls/bulk-import`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ calls }),
        });
        return res.json();
    },

    // ── LEADERBOARD ───────────────────────────────────────
    getLeaderboard: async (period = 'weekly') => {
        const res = await fetch(`${API_BASE_URL}/calls/leaderboard?period=${period}`, { headers: authHeaders() });
        return res.json();
    },

    // ── REPORTS ───────────────────────────────────────────
    getReports: async (period = 'month') => {
        const res = await fetch(`${API_BASE_URL}/reports/summary?period=${period}`, { headers: authHeaders() });
        return res.json();
    },

    getHourlyReport: async (date, agentId) => {
        const params = new URLSearchParams({ date: date || new Date().toISOString().split('T')[0] });
        if (agentId) params.append('agentId', agentId);
        const res = await fetch(`${API_BASE_URL}/calls/hourly?${params}`, { headers: authHeaders() });
        return res.json();
    },

    // ── BUSINESS USER ─────────────────────────────────────
    getBusinessDashboard: async () => {
        const res = await fetch(`${API_BASE_URL}/business/dashboard`, { headers: authHeaders() });
        return res.json();
    },

    getTeamCallStats: async (params = {}) => {
        const q = new URLSearchParams();
        if (params.date) q.append('date', params.date);
        if (params.agentId) q.append('agentId', params.agentId);
        const res = await fetch(`${API_BASE_URL}/calls/team-stats${q.toString() ? '?' + q : ''}`, { headers: authHeaders() });
        return res.json();
    },

    getMyTeam: async () => {
        const res = await fetch(`${API_BASE_URL}/business/team`, { headers: authHeaders() });
        return res.json();
    },

    createSalesperson: async (data) => {
        const res = await fetch(`${API_BASE_URL}/business/salespersons`, {
            method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    updateSalesperson: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/business/salespersons/${id}`, {
            method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
        });
        return res.json();
    },

    toggleSalespersonStatus: async (id) => {
        const res = await fetch(`${API_BASE_URL}/business/salespersons/${id}/toggle-status`, {
            method: 'PATCH', headers: authHeaders(),
        });
        return res.json();
    },

    resetSalespersonPassword: async (id, newPassword) => {
        const res = await fetch(`${API_BASE_URL}/business/salespersons/${id}/reset-password`, {
            method: 'PATCH', headers: authHeaders(),
            body: JSON.stringify({ newPassword }),
        });
        return res.json();
    },

    // ── LIVE FEED ─────────────────────────────────────────
    getLiveFeed: async (params = {}) => {
        const q = new URLSearchParams();
        const today = new Date().toISOString().split('T')[0];
        q.append('dateFrom', params.dateFrom || today);
        q.append('limit', params.limit || 50);
        const res = await fetch(`${API_BASE_URL}/calls?${q}`, { headers: authHeaders() });
        return res.json();
    },

    // ── CALL HISTORY (for salesperson) ─────────────────────
    getMyCallHistory: async ({ page = 1, limit = 20, search = '', callType = '', dateFrom = '', dateTo = '' } = {}) => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortField: 'calledAt',
            sortDir: 'desc',
        });
        if (search.trim()) params.append('search', search.trim());
        if (callType && callType !== 'All') params.append('callType', callType);
        if (dateFrom.trim()) params.append('dateFrom', dateFrom);
        if (dateTo.trim()) params.append('dateTo', dateTo);
        const res = await fetch(`${API_BASE_URL}/calls?${params.toString()}`, { headers: authHeaders() });
        return res.json();
    },
};

export default api;