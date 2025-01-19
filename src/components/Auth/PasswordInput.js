import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const PasswordInput = ({ value, onChange, placeholder = "Password", name = "password" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (value.length > displayValue.length && isVisible) {
      // New character typed, reveal it with animation
      const newChar = value[value.length - 1];
      setIsRevealing(true);
      setDisplayValue([
        ...displayValue,
        { char: newChar, revealed: false }
      ]);
      
      setTimeout(() => {
        setDisplayValue(prev => prev.map((item, idx) => 
          idx === prev.length - 1 ? { ...item, revealed: true } : item
        ));
        setIsRevealing(false);
      }, 150);
    } else {
      // Update display value normally
      setDisplayValue(value.split('').map(char => ({
        char,
        revealed: isVisible
      })));
    }
  }, [value, isVisible]);

  const toggleVisibility = () => {
    setIsAnimating(true);
    setIsVisible(!isVisible);
    if (!isVisible) {
      // When showing password, reveal all characters with sequential animation
      let currentIndex = 0;
      setIsRevealing(true);
      
      const interval = setInterval(() => {
        if (currentIndex < value.length) {
          setDisplayValue(prev => prev.map((item, idx) => 
            idx === currentIndex ? { ...item, revealed: true } : item
          ));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsRevealing(false);
        }
      }, 150);
    } else {
      // When hiding password, hide all characters immediately
      setDisplayValue(value.split('').map(char => ({
        char,
        revealed: false
      })));
    }
    setTimeout(() => setIsAnimating(false), 400); // Match animation duration
  };

  return (
    <div className="relative group">
      <div className="relative flex items-center">
        <input
          type="password"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          required
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
        >
          {isVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
      </div>
      {value.length > 0 && (
        <div className="absolute inset-0 bg-white flex items-center px-3 pointer-events-none">
          <div className="flex space-x-1 max-w-[calc(100%-2.5rem)]">
            {displayValue.map((charObj, index) => (
              <span
                key={index}
                className={`transition-all duration-300 transform ${
                  charObj.revealed && isVisible 
                    ? 'scale-110 text-blue-600 translate-y-0' 
                    : 'scale-100 text-gray-900 translate-y-0'
                } ${isRevealing && index === displayValue.length - 1 ? 'animate-bounce-once' : ''}`}
              >
                {!isVisible ? '•' : (charObj.revealed ? charObj.char : '•')}
              </span>
            ))}
            {isFocused && (
              <span className="animate-cursor-blink ml-0.5">|</span>
            )}
          </div>
        </div>
      )}
      {isRevealing && (
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 transition-all duration-300" 
          style={{ 
            width: `${(displayValue.filter(char => char.revealed).length / value.length) * 100}%`,
            transition: 'width 0.1s ease-out'
          }}
        />
      )}
    </div>
  );
};

export default PasswordInput; 