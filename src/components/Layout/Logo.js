import React, { useState, useEffect } from 'react';

const Logo = ({ size = 'normal', className = '' }) => {
  const [sparkles, setSparkles] = useState([]);
  const logoSize = size === 'large' ? 'w-16 h-16' : 'w-8 h-8 md:w-10 md:h-10';
  const textSize = size === 'large' ? 'text-4xl' : 'text-lg md:text-2xl';
  
  // Generate random sparkles
  const generateSparkle = () => ({
    id: Math.random(),
    size: Math.random() * 10 + 5,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `sparkle ${Math.random() * 1 + 0.5}s linear`,
    },
  });

  // Handle hover effect
  const handleHover = () => {
    const interval = setInterval(() => {
      setSparkles(prev => [...prev, generateSparkle()]);
    }, 50);

    return () => clearInterval(interval);
  };

  // Clean up old sparkles
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSparkles(prev => prev.slice(1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [sparkles]);

  return (
    <div 
      className={`flex items-center space-x-2 md:space-x-4 whitespace-nowrap ${className} group`}
      onMouseEnter={handleHover}
    >
      <div className={`relative flex-shrink-0 ${logoSize}`}>
        <div className="absolute inset-0 bg-blue-900/70 rounded-xl transform rotate-45 backdrop-blur-sm border border-blue-800/60 shadow-lg animate-float"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${size === 'large' ? 'h-10 w-10' : 'h-4 w-4 md:h-6 md:w-6'} text-blue-100 drop-shadow-lg`}
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
      <div className="relative flex-shrink-0">
        {/* Sparkles container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {sparkles.map(sparkle => (
            <div
              key={sparkle.id}
              className="absolute w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={sparkle.style}
            />
          ))}
        </div>
        
        {/* Company name with glow effect */}
        <span className={`
          ${textSize} font-bold tracking-wider text-transparent bg-clip-text 
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
          animate-aurora relative z-10 
          group-hover:animate-glow transition-all duration-300
        `}>
          ChatBuddy
        </span>
        
        {/* Enhanced glow effect on hover */}
        <div className="
          absolute inset-0 -inset-x-4 blur-2xl 
          bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        "/>
      </div>
    </div>
  );
};

export default Logo; 