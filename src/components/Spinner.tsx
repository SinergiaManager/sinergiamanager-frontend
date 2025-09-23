import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'blue-600', 
  message,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}
          style={{
            borderTopColor: `rgb(${color === 'blue-600' ? '37 99 235' : color})`
          }}
        ></div>
        {message && (
          <p className="mt-4 text-gray-600 text-sm animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;