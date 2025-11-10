import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <div className="dashboard-title">
                        <h1>🏠 QL Phòng Trọ - Dashboard</h1>
                        <p>Chào mừng quay trở lại, {user?.username}!</p>
                    </div>
                    <div className="dashboard-actions">
                        <span className="user-role">
                            {user?.roles?.includes('ROLE_MANAGER') ? '👨‍💼 Quản lý' : '👤 Người dùng'}
                        </span>
                        <button onClick={logout} className="logout-btn">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="dashboard-main">
                <div className="dashboard-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;