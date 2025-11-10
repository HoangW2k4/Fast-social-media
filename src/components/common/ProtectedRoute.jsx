import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// ProtectedRoute component - bảo vệ routes dựa trên authentication
const ProtectedRoute = ({ children, fallbackPath = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner message="Đang xác thực..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Lưu lại đường dẫn hiện tại để redirect sau khi login
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

// RoleProtectedRoute - bảo vệ routes dựa trên role cụ thể
const RoleProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/unauthorized',
  redirectToDefault = true 
}) => {
  const { isAuthenticated, checkRole, getUserDefaultPath, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner message="Đang xác thực quyền..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!checkRole(requiredRole)) {
    if (redirectToDefault) {
      // Redirect về trang default của user nếu không có quyền
      return <Navigate to={getUserDefaultPath()} replace />;
    } else {
      // Hoặc redirect đến trang unauthorized
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
};

// ManagerRoute - chỉ dành cho ROLE_MANAGER
const ManagerRoute = ({ children }) => {
  return (
    <RoleProtectedRoute requiredRole="ROLE_MANAGER">
      {children}
    </RoleProtectedRoute>
  );
};

// UserRoute - chỉ dành cho ROLE_USER
const UserRoute = ({ children }) => {
  return (
    <RoleProtectedRoute requiredRole="ROLE_USER">
      {children}
    </RoleProtectedRoute>
  );
};

// PublicRoute - chỉ cho phép truy cập khi chưa đăng nhập
const PublicRoute = ({ children }) => {
  const { isAuthenticated, getUserDefaultPath, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner message="Đang kiểm tra trạng thái..." />
      </div>
    );
  }

  if (isAuthenticated) {
    // Nếu đã đăng nhập, redirect về trang default
    return <Navigate to={getUserDefaultPath()} replace />;
  }

  return children;
};

// ConditionalRoute - hiển thị component khác nhau dựa trên role
const ConditionalRoute = ({ 
  managerComponent, 
  userComponent, 
  fallbackComponent = null 
}) => {
  const { isAuthenticated, isManager, isUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner message="Đang tải..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isManager() && managerComponent) {
    return managerComponent;
  }

  if (isUser() && userComponent) {
    return userComponent;
  }

  if (fallbackComponent) {
    return fallbackComponent;
  }

  return <Navigate to="/unauthorized" replace />;
};

// Unauthorized page component
const UnauthorizedPage = () => {
  const { getUserDefaultPath, logout } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
        Không có quyền truy cập
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#6b7280' }}>
        Bạn không có quyền truy cập vào trang này.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => window.location.href = getUserDefaultPath()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Về trang chủ
        </button>
        <button
          onClick={logout}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export {
  ProtectedRoute,
  RoleProtectedRoute,
  ManagerRoute,
  UserRoute,
  PublicRoute,
  ConditionalRoute,
  UnauthorizedPage
};

export default ProtectedRoute;