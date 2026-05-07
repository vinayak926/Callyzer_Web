import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: '🔔',
        warning: '⚠️'
    };

    return (
        <div className={`fixed top-5 right-5 z-50 ${bgColors[type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in`}>
            <span className="text-lg">{icons[type]}</span>
            <div>
                <p className="text-sm font-semibold">New Call Alert!</p>
                <p className="text-xs opacity-90">{message}</p>
            </div>
            <button onClick={onClose} className="ml-3 text-white/70 hover:text-white">
                ✕
            </button>
        </div>
    );
};

export default Toast;