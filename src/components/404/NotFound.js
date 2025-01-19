import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent all interactions except the home button
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Prevent all keyboard shortcuts
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
        e.preventDefault();
      }
      // Only allow Tab key for accessibility
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
    };

    // Disable all header buttons
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = 'auto';
      if (header) {
        header.style.display = 'block';
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600"
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 pointer-events-none">404</h1>
        <p className="text-xl mb-8 pointer-events-none">Access Denied</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound; 