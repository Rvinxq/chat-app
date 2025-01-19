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
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          required
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-12"
        />
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
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={toggleVisibility}
            className="h-full px-3 flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <div className="eye-container">
              <div className={`eye-icon ${isVisible ? 'animate-eye-open' : isAnimating ? 'animate-eye-close' : ''}`}>
                {isVisible ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
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