import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserInfo } from '../features/auth/authSlice';

const AdminRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userInfo = useSelector(selectUserInfo);

    if (isAuthenticated && userInfo?.role === 'admin') {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;
