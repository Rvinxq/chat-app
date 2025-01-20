import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SecurityError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };

    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();

    // Force reload after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-600">
      <div className="text-white text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">Developer tools are not allowed on this site.</p>
        <p className="text-sm">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default SecurityError; 