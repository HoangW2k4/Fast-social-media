import React, { useState } from 'react';
// Import Manager components
import ManagerLayout from '../../manager/components/Layout/ManagerLayout';
import ManagerDashboard from '../../manager/components/pages/Dashboard';
import PostsManage from '../../manager/components/pages/PostsManage';
import Dashboard from './Dashboard';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ManagerDashboard />;
            case 'posts':
                return <PostsManage />;
            case 'original':
                return <Dashboard />;
            default:
                return <ManagerDashboard />;
        }
    };

    return (
        <ManagerLayout>
            <div style={{ padding: '20px' }}>
                {/* Tab Navigation */}
                <div style={{ 
                    marginBottom: '20px', 
                    borderBottom: '2px solid #e9ecef',
                    display: 'flex',
                    gap: '20px'
                }}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'dashboard' ? '#007bff' : 'transparent',
                            color: activeTab === 'dashboard' ? 'white' : '#007bff',
                            border: `2px solid ${activeTab === 'dashboard' ? '#007bff' : '#e9ecef'}`,
                            borderRadius: '6px 6px 0 0',
                            cursor: 'pointer',
                            borderBottom: 'none',
                            fontWeight: '500'
                        }}
                    >
                        📊 Manager Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'posts' ? '#28a745' : 'transparent',
                            color: activeTab === 'posts' ? 'white' : '#28a745',
                            border: `2px solid ${activeTab === 'posts' ? '#28a745' : '#e9ecef'}`,
                            borderRadius: '6px 6px 0 0',
                            cursor: 'pointer',
                            borderBottom: 'none',
                            fontWeight: '500'
                        }}
                    >
                        📝 Posts Management
                    </button>
                    <button
                        onClick={() => setActiveTab('original')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'original' ? '#6f42c1' : 'transparent',
                            color: activeTab === 'original' ? 'white' : '#6f42c1',
                            border: `2px solid ${activeTab === 'original' ? '#6f42c1' : '#e9ecef'}`,
                            borderRadius: '6px 6px 0 0',
                            cursor: 'pointer',
                            borderBottom: 'none',
                            fontWeight: '500'
                        }}
                    >
                        📈 Original Dashboard
                    </button>
                </div>

                {/* Content Area */}
                <div style={{ 
                    minHeight: '600px',
                    background: 'white',
                    borderRadius: '0 6px 6px 6px',
                    padding: activeTab === 'original' ? '20px' : '0'
                }}>
                    {renderContent()}
                </div>
            </div>
        </ManagerLayout>
    );
};

export default DashboardPage;