import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home.jsx";
import LogIn from "../pages/LogIn.jsx";
import DashboardPage from "../pages/dashboard/index.jsx";
import AuthProvider from "../context/AuthContext.jsx";
import { 
  ManagerRoute, 
  UserRoute, 
  PublicRoute, 
  UnauthorizedPage 
} from "../components/common/ProtectedRoute.jsx";

// Import Manager components
import ManagerDashboard from "../manager/components/pages/Dashboard/index.jsx";
import PostsManage from "../manager/components/pages/PostsManage/index.jsx";
import ManagerLayout from "../manager/components/Layout/ManagerLayout.jsx";

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route - chỉ cho phép truy cập khi chưa đăng nhập */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LogIn />
              </PublicRoute>
            } 
          />
          
          {/* Manager route - chỉ dành cho ROLE_MANAGER */}
          <Route 
            path="/dashboard" 
            element={
              <ManagerRoute>
                <DashboardPage />
              </ManagerRoute>
            } 
          />
          
          {/* Manager Dashboard */}
          <Route 
            path="/manager" 
            element={
              <ManagerRoute>
                <ManagerLayout>
                  <ManagerDashboard />
                </ManagerLayout>
              </ManagerRoute>
            } 
          />
          
          {/* Manager Dashboard - default */}
          <Route 
            path="/manager/dashboard" 
            element={
              <ManagerRoute>
                <ManagerLayout>
                  <ManagerDashboard />
                </ManagerLayout>
              </ManagerRoute>
            } 
          />
          
          {/* Posts Management */}
          <Route 
            path="/manager/posts" 
            element={
              <ManagerRoute>
                <ManagerLayout>
                  <PostsManage />
                </ManagerLayout>
              </ManagerRoute>
            } 
          />
          
          {/* User route - chỉ dành cho ROLE_USER */}
          <Route 
            path="/" 
            element={
              <UserRoute>
                <Home />
              </UserRoute>
            } 
          />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Catch all other routes - redirect to appropriate dashboard */}
          <Route 
            path="*" 
            element={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
              }}>
                <div>
                  <h2>Trang không tìm thấy</h2>
                  <p>Đường dẫn bạn truy cập không tồn tại.</p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                  >
                    Về trang đăng nhập
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;   