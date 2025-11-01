import React from 'react';

const LoadingHeader = ({ isLoading, children }) => {
  return (
    <div className="header-container">
      {children}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LoadingHeader;
