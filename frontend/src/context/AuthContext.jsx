import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isTokenExpired = (tok) => {
        try {
            const { exp } = jwtDecode(tok);
            return Date.now() >= exp * 1000;
        } catch {
            return true;
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && !isTokenExpired(savedToken)) {
            try {
                const parsed = JSON.parse(savedUser);
                const validRoles = ['super_admin', 'business_user', 'salesperson'];
                if (validRoles.includes(parsed?.role)) {
                    setToken(savedToken);
                    setUser(parsed);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else if (savedToken) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = (tokenValue, userData) => {
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);

        try {
            window.postMessage({ type: 'CALLYZER_TOKEN_UPDATE', token: tokenValue }, '*');
        } catch (_) {}

    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        window.dispatchEvent(new Event('authChange'));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};