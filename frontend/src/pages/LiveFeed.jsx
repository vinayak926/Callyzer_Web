import React, { useEffect, useState, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { API_BASE_URL } from '../config';

const fmtDuration = (sec) => {
    if (!sec || sec === 0) return '0s';
    const m = Math.floor(sec / 60), s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
};

const statusColor = (status) => {
    if (status === 'Connected') return '#17C964';
    if (status === 'Missed') return '#F31260';
    if (status === 'Rejected') return '#F5A524';
    return '#6B7A99';
};

const statusBg = (status) => {
    if (status === 'Connected') return '#E8FBF0';
    if (status === 'Missed') return '#FEE7EF';
    if (status === 'Rejected') return '#FFF4E0';
    return '#F0F2F7';
};

const callTypeLabel = (type) => type === 'Incoming' ? '↙ In' : '↗ Out';
const callTypeBg = (type) => type === 'Incoming' ? '#E6F1FE' : '#F0E6FF';
const callTypeColor = (type) => type === 'Incoming' ? '#006FEE' : '#7828C8';

export default function LiveFeed() {
    const { user } = useContext(AuthContext);
    const [calls, setCalls] = useState([]);
    const [isLive, setIsLive] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [newCallCount, setNewCallCount] = useState(0);
    const socketRef = useRef(null);
    const [pulseAnim] = useState({ transform: 'scale(1)' });

    useEffect(() => {
        const interval = setInterval(() => {
            // Pulse animation effect
        }, 600);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => { loadRecentCalls(); }, []);

    useEffect(() => {
        if (!user?._id) return;

        const API_URL = API_BASE_URL.replace('/api', '');
        const socket = io(API_URL, { transports: ['websocket'], reconnectionAttempts: 5 });
        socketRef.current = socket;

        socket.on('connect', () => {
            setIsLive(true);
            socket.emit('join-user', { userId: user._id, role: user.role });
        });

        socket.on('disconnect', () => setIsLive(false));

        socket.on('new-call', (callData) => {
            setCalls(prev => prev.find(c => c._id === callData._id) ? prev : [{ ...callData, isNew: true }, ...prev].slice(0, 100));
            setNewCallCount(prev => prev + 1);
        });

        return () => socket.disconnect();
    }, [user?._id]);

    const loadRecentCalls = async () => {
        try {
            setRefreshing(true);
            const today = new Date().toISOString().split('T')[0];
            const data = await api.getCallLogs({ dateFrom: today, limit: 50 });
            if (data?.logs) setCalls(data.logs.map(c => ({ ...c, isNew: false })));
        } catch (err) { console.error(err); }
        finally { setRefreshing(false); }
    };

    const connected = calls.filter(c => c.callStatus === 'Connected').length;
    const missed = calls.filter(c => c.callStatus === 'Missed').length;
    const total = calls.length;
    const connectRate = total > 0 ? Math.round((connected / total) * 100) : 0;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-around">
                <div className="text-center">
                    <p className="text-xl font-extrabold text-indigo-600">{total}</p>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                    <p className="text-xl font-extrabold text-green-600">{connected}</p>
                    <p className="text-xs text-gray-500 font-medium">Connected</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                    <p className="text-xl font-extrabold text-red-500">{missed}</p>
                    <p className="text-xs text-gray-500 font-medium">Missed</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                    <p className="text-xl font-extrabold text-indigo-600">{connectRate}%</p>
                    <p className="text-xs text-gray-500 font-medium">Rate</p>
                </div>
            </div>

            {/* Live Indicator Header */}
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-white font-bold text-lg">Live Feed</h2>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="text-white text-xs font-bold">{isLive ? 'LIVE' : 'Offline'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {newCallCount > 0 && (
                        <div className="bg-white/20 rounded-full px-3 py-1">
                            <span className="text-white text-xs font-bold">{newCallCount} new</span>
                        </div>
                    )}
                    <button onClick={() => { loadRecentCalls(); setNewCallCount(0); }} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">🔄</button>
                </div>
            </div>

            {/* Call List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {calls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <div className="text-5xl mb-4">📞</div>
                        <p className="text-gray-500 text-sm">No call activity yet</p>
                        <p className="text-gray-400 text-xs mt-1">When team members make calls, they'll appear here</p>
                    </div>
                ) : (
                    calls.map((call, idx) => (
                        <div key={call._id || idx} className={`bg-white rounded-xl border ${call.isNew ? 'border-indigo-400 shadow-md' : 'border-gray-100'} p-4`}>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-bold text-gray-900">{call.customerName || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{call.customerNumber}</p>
                                </div>
                                {call.isNew && <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold`} style={{ backgroundColor: callTypeBg(call.callType), color: callTypeColor(call.callType) }}>{callTypeLabel(call.callType)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold`} style={{ backgroundColor: statusBg(call.callStatus), color: statusColor(call.callStatus) }}>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: statusColor(call.callStatus) }} />
                                    {call.callStatus}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>👤 {call.agent?.name || 'Unknown'}</span>
                                <div className="flex items-center gap-3">
                                    <span>⏱ {fmtDuration(call.durationSeconds)}</span>
                                    <span>{timeAgo(call.calledAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}