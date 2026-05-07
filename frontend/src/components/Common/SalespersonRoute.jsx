// src/components/Common/SalespersonRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function SalespersonRoute() {
    const { user } = useContext(AuthContext);
    return user?.role === 'salesperson' ? <Outlet /> : <Navigate to="/" replace />;
}