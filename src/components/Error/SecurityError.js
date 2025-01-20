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

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Force reload with clean slate after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/?blocked=true';
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.onpopstate = null;
    };
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