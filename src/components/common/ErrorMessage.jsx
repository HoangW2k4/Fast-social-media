import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message = 'Có lỗi xảy ra', 
  onRetry = null,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faExclamationTriangle;
      default:
        return faExclamationTriangle;
    }
  };

  return (
    <div className={`error-container ${type}`}>
      <div className="error-content">
        <FontAwesomeIcon icon={getIcon()} className="error-icon" />
        <div className="error-text">
          <h3 className="error-title">
            {type === 'warning' ? 'Cảnh báo' : type === 'info' ? 'Thông báo' : 'Lỗi'}
          </h3>
          <p className="error-message">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          <FontAwesomeIcon icon={faRefresh} />
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 