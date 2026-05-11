import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Layout & Guards
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import BusinessRoute from './components/Common/BusinessRoute';
import SalespersonRoute from './components/Common/SalespersonRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Pending from './pages/Pending';

// Shared Pages (all roles)
import CallLogs from './pages/CallLogs';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import LiveFeed from './pages/LiveFeed';
import CallHistory from './pages/CallHistory';
import DeviceCallSync from './pages/DeviceCallSync';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminApprovals from './pages/admin/AdminApprovals';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import MyTeam from './pages/business/MyTeam';
import BusinessLeads from './pages/business/Leads';
import WorkedLeads    from './pages/business/WorkedLeads'; 

// Salesperson Pages
import SalespersonDashboard from './pages/salesperson/SalespersonDashboard';
import SalespersonLeads from './pages/salesperson/MyLeads';

import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Subscription from './pages/business/Subscription';


function AppRoutes() {
    const { user, token, loading } = React.useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route element={<Layout />}>
                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/approvals" element={<AdminApprovals />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                        <Route path="/admin/call-logs" element={<CallLogs />} />
                        <Route path="/admin/reports" element={<Reports />} />
                        <Route path="/admin/leaderboard" element={<Leaderboard />} />
                    </Route>

                    {/* Business User Routes */}
                    <Route element={<BusinessRoute />}>
                        <Route path="/business/dashboard" element={<BusinessDashboard />} />
                        <Route path="/business/team" element={<MyTeam />} />
                        <Route path="/business/leads"        element={<BusinessLeads />} />
                        <Route path='/business/worked-leads' element={<WorkedLeads />} />  
                        <Route path="/business/live-feed" element={<LiveFeed />} />
                        <Route path="/business/call-logs" element={<CallLogs />} />
                        <Route path="/business/reports" element={<Reports />} />
                        <Route path="/business/leaderboard" element={<Leaderboard />} />
                        <Route path="/business/sync" element={<DeviceCallSync />} />
                        <Route path="/business/subscription" element={<Subscription />} />
                    </Route>

                    {/* Salesperson Routes */}
                    <Route element={<SalespersonRoute />}>
                        <Route path="/salesperson/dashboard" element={<SalespersonDashboard />} />
                        <Route path="/salesperson/leads"       element={<SalespersonLeads />} />
                        <Route path="/salesperson/call-logs" element={<CallLogs />} />
                        <Route path="/salesperson/history" element={<CallHistory />} />
                        <Route path="/salesperson/sync" element={<DeviceCallSync />} />
                        <Route path="/salesperson/reports" element={<Reports />} />
                        <Route path="/salesperson/leaderboard" element={<Leaderboard />} />
                    </Route>
                </Route>
            </Route>

            {/* Default redirect based on role */}
            <Route path="/" element={
                !token ? <Navigate to="/login" /> :
                user?.role === 'super_admin' ? <Navigate to="/admin/dashboard" /> :
                user?.role === 'business_user' ? <Navigate to="/business/dashboard" /> :
                <Navigate to="/salesperson/dashboard" />
            } />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;