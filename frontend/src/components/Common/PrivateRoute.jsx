// src/components/Common/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function PrivateRoute() {
    const { token, loading } = useContext(AuthContext);
    if (loading) return null;
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}