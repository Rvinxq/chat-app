import React from 'react';

const Logo = ({ size = 'normal', className = '' }) => {
  const logoSize = size === 'large' ? 'w-16 h-16' : 'w-8 h-8 md:w-10 md:h-10';
  const textSize = size === 'large' ? 'text-4xl' : 'text-lg md:text-2xl';
  
  return (
    <div className={`flex items-center space-x-2 md:space-x-4 whitespace-nowrap ${className}`}>
      <div className={`relative flex-shrink-0 ${logoSize}`}>
        <div className="absolute inset-0 bg-blue-900/70 rounded-xl transform rotate-45 backdrop-blur-sm border border-blue-800/60 shadow-lg animate-float"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${size === 'large' ? 'h-10 w-10' : 'h-4 w-4 md:h-6 md:w-6'} text-blue-100 drop-shadow-lg transform-gpu`}
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
      <div className="relative flex-shrink-0 group">
        <span className={`
          ${textSize} 
          font-bold 
          tracking-wider 
          text-transparent 
          bg-clip-text 
          bg-gradient-to-r 
          from-cyan-400 
          via-blue-500 
          to-purple-600 
          relative 
          z-10 
          transform-gpu
          transition-all 
          duration-300 
          animate-gradient-x
          group-hover:scale-105
          group-hover:brightness-110
        `}>
          ChatBuddy
        </span>
        <div className="
          absolute 
          inset-0 
          -inset-x-4 
          bg-gradient-to-r 
          from-cyan-500/30 
          via-blue-500/30 
          to-purple-500/30 
          filter 
          blur-xl 
          scale-110
          opacity-0
          group-hover:opacity-100 
          transition-all 
          duration-300
          transform-gpu
        "/>
      </div>
    </div>
  );
};

export default Logo; 