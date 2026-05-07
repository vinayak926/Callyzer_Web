import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function DeviceCallSync() {
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    const showMessage = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSyncNow = async () => {
        setSyncing(true);
        showMessage('Syncing call logs to server...', 'info');
        
        // Simulate sync - This would normally call the device sync API
        // For web, device sync is not available, so show a message
        setTimeout(() => {
            showMessage('Device sync is only available on the mobile app. Please use the mobile app to sync your call logs.', 'warning');
            setSyncing(false);
        }, 1500);
    };

    const stats = { total: 0, incoming: 0, outgoing: 0, missed: 0 };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-8 rounded-b-3xl">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">📲</div>
                    <h1 className="text-2xl font-bold">Device Call Sync</h1>
                    <p className="text-purple-100 text-sm mt-1">Sync calls from your mobile device</p>
                </div>
            </div>

            {message && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-slide-in ${
                    messageType === 'success' ? 'bg-green-500 text-white' :
                    messageType === 'error' ? 'bg-red-500 text-white' :
                    messageType === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                }`}>
                    {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : messageType === 'warning' ? '⚠️' : 'ℹ️'} {message}
                </div>
            )}

            <div className="p-6 max-w-2xl mx-auto w-full">
                {/* Permission Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-5">
                    <div className="text-6xl mb-4">🔐</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile App Feature</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Device call sync is only available on the Callyzer mobile app for Android.
                        Please download the app from the Play Store to automatically sync your call logs.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-left mt-4">
                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                            <span className="text-lg">📋</span>
                            <div>
                                <p className="text-xs font-bold text-gray-700">READ_CALL_LOG</p>
                                <p className="text-xs text-gray-500">Read your call history</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                            <span className="text-lg">📱</span>
                            <div>
                                <p className="text-xs font-bold text-gray-700">READ_PHONE_STATE</p>
                                <p className="text-xs text-gray-500">Detect call events</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sync Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">⚡ Sync Settings</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Real-time Sync</p>
                                    <p className="text-xs text-gray-400">Auto-syncs after every call ends</p>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-5 bg-gray-300 rounded-full opacity-50"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Background Sync</p>
                                    <p className="text-xs text-gray-400">Sync even when app is closed</p>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-5 bg-gray-300 rounded-full opacity-50"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sync Button */}
                <button
                    onClick={handleSyncNow}
                    disabled={syncing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                    {syncing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Syncing...</> : '↑ Sync Now (Mobile Only)'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-6">
                    📌 Note: This feature is available only on the Android mobile app.<br />
                    On web, you can still add calls manually from the Call Logs screen.
                </p>
            </div>
        </div>
    );
}