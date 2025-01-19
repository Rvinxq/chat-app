import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';

const LoadingScreen = ({ onLoadComplete }) => {
  const [showEncryption, setShowEncryption] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef();

  useEffect(() => {
    const animate = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsedTime / 2000) * 100, 100); // 2000ms is max loading time
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Show elements based on progress instead of fixed timeouts
    const progressCheck = setInterval(() => {
      const currentProgress = ((Date.now() - startTimeRef.current) / 2000) * 100;
      if (currentProgress >= 40) setShowEncryption(true);
      if (currentProgress >= 80) setShowCreator(true);
    }, 50);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(progressCheck);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex flex-col items-center justify-center">
      {/* Logo Container */}
      <div className="animate-fadeIn relative">
        <Logo size="large" />
        {/* Progress Ring */}
        <div className="absolute -inset-4 rounded-full border-2 border-white/10" />
        <div 
          className="absolute -inset-4 rounded-full border-2 border-white/30 transition-all duration-100 origin-center"
          style={{ 
            clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
          }} 
        />
      </div>

      {/* Encryption Text */}
      <div className={`mt-8 transition-all duration-1000 transform ${
        showEncryption 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex items-center space-x-2 text-white/80">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-sm font-medium">End-to-end encrypted</span>
        </div>
      </div>

      {/* Creator Text */}
      <div className={`absolute bottom-8 transition-all duration-1000 transform ${
        showCreator 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        <p className="text-white/60 text-sm">
          Created by <span className="font-medium text-white">Swarnabha</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 