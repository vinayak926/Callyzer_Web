// src/components/Common/BusinessRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function BusinessRoute() {
    const { user } = useContext(AuthContext);
    return user?.role === 'business_user' ? <Outlet /> : <Navigate to="/" replace />;
}