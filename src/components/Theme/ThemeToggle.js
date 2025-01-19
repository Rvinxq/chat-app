import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, setIsDark } = useTheme();

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsDark(!isDark)}
        className="relative p-2 rounded-xl bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg group"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Sun */}
        <div className={`absolute inset-0 transition-all duration-300 transform ${
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}>
          <div className="absolute inset-1.5 rounded-lg bg-yellow-300 shadow-inner" />
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 45}deg) translateY(-12px)`,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div className={`relative w-8 h-8 transition-all duration-300 transform ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-full bg-blue-100 overflow-hidden">
            <div className="absolute right-0 w-6 h-8 bg-blue-900 rounded-full transform translate-x-3" />
          </div>
          {/* Stars */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-100 rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
              }}
            />
          ))}
        </div>
      </button>
      
      {/* Mode Text */}
      <span className="mt-1 text-xs font-medium text-white/70 dark:text-white/70 transition-colors duration-200">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
    </div>
  );
};

export default ThemeToggle; 