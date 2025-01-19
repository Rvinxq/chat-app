import React from 'react';

const Logo = ({ size = 'normal' }) => {
  const logoSize = size === 'large' ? 'w-16 h-16' : 'w-10 h-10';
  const textSize = size === 'large' ? 'text-4xl' : 'text-2xl';
  
  return (
    <div className="flex items-center space-x-4">
      <div className={`relative ${logoSize}`}>
        <div className="absolute inset-0 bg-blue-900/70 rounded-xl transform rotate-45 backdrop-blur-sm border border-blue-800/60 shadow-lg animate-float"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${size === 'large' ? 'h-10 w-10' : 'h-6 w-6'} text-blue-100 drop-shadow-lg`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      <div className="relative">
        <span className={`${textSize} font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-aurora relative z-10`}>
          ChatLings
        </span>
        <div className="aurora-blur absolute inset-0 -inset-x-4 blur-2xl bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 animate-aurora-blur"></div>
      </div>
    </div>
  );
};

export default Logo; 