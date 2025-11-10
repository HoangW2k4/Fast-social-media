import React from 'react';
import './StatCard.css';

function StatCard({ title, value, bonus, icon, background }) {
    const formatNumber = (num) => {
        if (!num && num !== 0) return '0';
        return num.toLocaleString('vi-VN');
    };

    return (
        <div className="stat-card" style={{ background: background }}>
            <div className="stat-text">
                <p className="stat-title">{title}</p>
                <p className="stat-value">{formatNumber(value)}</p>
                <p className="stat-bonus">{bonus}</p>
            </div>
            <div className="stat-icon">{icon}</div>
        </div>
    );
}

export default StatCard;