// import React, { useState, useEffect } from 'react';
// import { api } from '../services/api';

// export default function DeviceCallSync() {
//     const [loading, setLoading] = useState(false);
//     const [syncing, setSyncing] = useState(false);
//     const [message, setMessage] = useState('');
//     const [messageType, setMessageType] = useState('info');

//     const showMessage = (msg, type = 'info') => {
//         setMessage(msg);
//         setMessageType(type);
//         setTimeout(() => setMessage(''), 5000);
//     };

//     const handleSyncNow = async () => {
//         setSyncing(true);
//         showMessage('Syncing call logs to server...', 'info');
        
//         // Simulate sync - This would normally call the device sync API
//         // For web, device sync is not available, so show a message
//         setTimeout(() => {
//             showMessage('Device sync is only available on the mobile app. Please use the mobile app to sync your call logs.', 'warning');
//             setSyncing(false);
//         }, 1500);
//     };

//     const stats = { total: 0, incoming: 0, outgoing: 0, missed: 0 };

//     return (
//         <div className="flex flex-col h-full bg-gray-50">
//             {/* Header Banner */}
//             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-8 rounded-b-3xl">
//                 <div className="max-w-2xl mx-auto text-center">
//                     <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">📲</div>
//                     <h1 className="text-2xl font-bold">Device Call Sync</h1>
//                     <p className="text-purple-100 text-sm mt-1">Sync calls from your mobile device</p>
//                 </div>
//             </div>

//             {message && (
//                 <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-slide-in ${
//                     messageType === 'success' ? 'bg-green-500 text-white' :
//                     messageType === 'error' ? 'bg-red-500 text-white' :
//                     messageType === 'warning' ? 'bg-yellow-500 text-white' :
//                     'bg-blue-500 text-white'
//                 }`}>
//                     {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : messageType === 'warning' ? '⚠️' : 'ℹ️'} {message}
//                 </div>
//             )}

//             <div className="p-6 max-w-2xl mx-auto w-full">
//                 {/* Permission Card */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-5">
//                     <div className="text-6xl mb-4">🔐</div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile App Feature</h3>
//                     <p className="text-gray-500 text-sm mb-6">
//                         Device call sync is only available on the Callyzer mobile app for Android.
//                         Please download the app from the Play Store to automatically sync your call logs.
//                     </p>
//                     <div className="grid grid-cols-2 gap-3 text-left mt-4">
//                         <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
//                             <span className="text-lg">📋</span>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-700">READ_CALL_LOG</p>
//                                 <p className="text-xs text-gray-500">Read your call history</p>
//                             </div>
//                         </div>
//                         <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
//                             <span className="text-lg">📱</span>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-700">READ_PHONE_STATE</p>
//                                 <p className="text-xs text-gray-500">Detect call events</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sync Controls */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
//                     <div className="px-5 py-4 border-b border-gray-100">
//                         <h3 className="font-bold text-gray-800">⚡ Sync Settings</h3>
//                     </div>
//                     <div className="p-5 space-y-4">
//                         <div>
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-semibold text-gray-800 text-sm">Real-time Sync</p>
//                                     <p className="text-xs text-gray-400">Auto-syncs after every call ends</p>
//                                 </div>
//                                 <div className="relative">
//                                     <div className="w-10 h-5 bg-gray-300 rounded-full opacity-50"></div>
//                                     <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="border-t border-gray-100 pt-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-semibold text-gray-800 text-sm">Background Sync</p>
//                                     <p className="text-xs text-gray-400">Sync even when app is closed</p>
//                                 </div>
//                                 <div className="relative">
//                                     <div className="w-10 h-5 bg-gray-300 rounded-full opacity-50"></div>
//                                     <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sync Button */}
//                 <button
//                     onClick={handleSyncNow}
//                     disabled={syncing}
//                     className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
//                 >
//                     {syncing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Syncing...</> : '↑ Sync Now (Mobile Only)'}
//                 </button>

//                 <p className="text-center text-xs text-gray-400 mt-6">
//                     📌 Note: This feature is available only on the Android mobile app.<br />
//                     On web, you can still add calls manually from the Call Logs screen.
//                 </p>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import {
    Smartphone, Upload, CheckCircle2, XCircle, RefreshCcw, Clock,
    Phone, Download, AlertCircle, Wifi,
} from 'lucide-react';
import {
    Button, Card, Badge, StatCard, LoadingPage, EmptyState, Alert, SectionHeader,
} from '../components/UI';

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

const fmtDuration = (s) => {
    if (!s) return '0s';
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

export default function DeviceCallSync() {
    const { user } = useContext(AuthContext);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [syncHistory, setSyncHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deviceInfo, setDeviceInfo] = useState(null);

    const fetchHistory = async () => {
        try {
            const data = await api.getSyncHistory();
            setSyncHistory(data?.history || data?.syncs || []);
            setDeviceInfo(data?.device || null);
        } catch (e) { console.log(e); }
        setLoading(false);
    };

    useEffect(() => { fetchHistory(); }, []);

    const handleSync = async () => {
        setSyncing(true);
        setSyncResult(null);
        try {
            const data = await api.syncDeviceCalls();
            setSyncResult({
                success: true,
                synced: data.synced ?? data.count ?? 0,
                skipped: data.skipped ?? 0,
                message: data.message || 'Sync completed successfully!',
            });
            fetchHistory();
        } catch (err) {
            setSyncResult({
                success: false,
                message: err?.message || 'Sync failed. Please check your device connection.',
            });
        }
        setSyncing(false);
    };

    const totalSynced = syncHistory.reduce((acc, s) => acc + (s.synced || 0), 0);
    const lastSync = syncHistory[0];

    if (loading) return <LoadingPage />;

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Device Call Sync</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                    Sync call logs from your mobile device to Callyzer
                </p>
            </div>

            {/* Sync Result Alert */}
            {syncResult && (
                <div className="animate-fade-in">
                    {syncResult.success ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-emerald-800">Sync Successful!</p>
                                <p className="text-sm text-emerald-600 mt-0.5">{syncResult.message}</p>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-xs font-semibold text-emerald-700">
                                        ✓ {syncResult.synced} calls synced
                                    </span>
                                    {syncResult.skipped > 0 && (
                                        <span className="text-xs font-semibold text-emerald-600">
                                            ↷ {syncResult.skipped} skipped (duplicates)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                            <XCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-rose-800">Sync Failed</p>
                                <p className="text-sm text-rose-600 mt-0.5">{syncResult.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Sync Card */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Device Status */}
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Smartphone size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Device Status</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <p className="text-xs text-emerald-600 font-semibold">Connected</p>
                                </div>
                            </div>
                        </div>
                        {deviceInfo && (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Device</span>
                                    <span className="font-medium text-slate-800">{deviceInfo.model || 'Android'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Phone</span>
                                    <span className="font-medium text-slate-800 font-mono">{deviceInfo.phone || user?.phone || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Last Sync</span>
                                    <span className="font-medium text-slate-800">{fmtDateTime(lastSync?.createdAt)}</span>
                                </div>
                            </div>
                        )}
                        {!deviceInfo && (
                            <p className="text-sm text-slate-400 text-center py-2">No device info available</p>
                        )}
                    </Card>

                    {/* Sync Button */}
                    <Card>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                                <Upload size={28} className="text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1.5">Sync Now</h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Pull your latest call logs from your mobile device into Callyzer
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                loading={syncing}
                                onClick={handleSync}
                                className="w-full"
                                icon={syncing ? undefined : RefreshCcw}
                            >
                                {syncing ? 'Syncing calls...' : 'Start Sync'}
                            </Button>
                            {syncing && (
                                <p className="text-xs text-slate-400 mt-3 animate-pulse">
                                    Fetching calls from device...
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Tips */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={15} className="text-amber-600" />
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Tips</p>
                        </div>
                        <ul className="space-y-1.5 text-xs text-amber-700">
                            <li>• Ensure your device is connected to the internet</li>
                            <li>• Grant call log permissions to the Callyzer app</li>
                            <li>• Duplicate calls are automatically skipped</li>
                            <li>• Syncs the last 30 days of call history</li>
                        </ul>
                    </div>
                </div>

                {/* Sync History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Sync History</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {totalSynced.toLocaleString()} total calls synced lifetime
                                    </p>
                                </div>
                                <Badge variant="blue">{syncHistory.length} syncs</Badge>
                            </div>
                        </div>

                        {syncHistory.length === 0 ? (
                            <EmptyState
                                icon={Wifi}
                                title="No sync history"
                                description="Your sync history will appear here after your first sync."
                            />
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {syncHistory.map((sync, i) => (
                                    <div key={sync._id || i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${sync.success !== false ? 'bg-emerald-50' : 'bg-rose-50'
                                            }`}>
                                            {sync.success !== false
                                                ? <CheckCircle2 size={17} className="text-emerald-600" />
                                                : <XCircle size={17} className="text-rose-500" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {sync.synced || 0} calls synced
                                                </p>
                                                {sync.skipped > 0 && (
                                                    <span className="text-xs text-slate-400">· {sync.skipped} skipped</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">{fmtDateTime(sync.createdAt)}</p>
                                        </div>
                                        <Badge variant={sync.success !== false ? 'green' : 'red'}>
                                            {sync.success !== false ? 'Success' : 'Failed'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
