import React from 'react';
import './Ranking.css';

function Ranking({ title, data, icon, iconColor }) {
    const formatNumber = (num) => {
        if (!num && num !== 0) return '0';
        return num.toLocaleString('vi-VN');
    };

    return (
        <div className="ranking-container">
            <h4 className="ranking-title">{title}</h4>
            <div className="ranking-list">
                {data.map((item, index) => (
                    <div key={index} className="ranking-item">
                        <div className="ranking-thumbnail">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.title} />
                            ) : (
                                <div className="thumbnail-placeholder">🏠</div>
                            )}
                        </div>
                        <div className="ranking-info">
                            <p className="ranking-item-title">{item.title}</p>
                            <p className="ranking-value">
                                <span className="ranking-icon" style={{ color: iconColor }}>
                                    {icon}
                                </span>
                                {formatNumber(item.value)}
                            </p>
                        </div>
                        <div className="ranking-position">
                            #{index + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Ranking;