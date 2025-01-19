import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';
import LoadingScreen from './components/Layout/LoadingScreen';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ChatWindow from './components/Chat/ChatWindow';
import Header from './components/Layout/Header';
import NotFound from './components/404/NotFound';
import { ThemeProvider } from './context/ThemeContext';
import VerifyEmail from './components/Auth/VerifyEmail';
import { Toaster } from 'react-hot-toast';
import AdminPage from './components/Admin/AdminPage';

// Security utility function
const secureApp = () => {
  const redirectToError = () => {
    window.location.href = '/error';
    return false;
  };

  // Continuous monitoring for dev tools
  const devToolsCheck = () => {
    const threshold = 160;
    
    // Check for dev tools being open
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold ||
      window.Firebug?.chrome?.isInitialized ||
      /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor) && window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      redirectToError();
    }

    // Detect console opening
    const checkConsole = () => {
      const startTime = new Date();
      debugger;
      const endTime = new Date();
      if (endTime - startTime > 100) {
        redirectToError();
      }
    };

    // Regular checks
    setInterval(checkConsole, 1000);
    setInterval(devToolsCheck, 1000);
  };

  devToolsCheck();

  // Existing protections
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      redirectToError();
    }
  });

  // Override console methods
  const consoleOverrides = () => {
    const noop = () => redirectToError();
    ['log', 'info', 'warn', 'error', 'debug', 'clear'].forEach(method => {
      console[method] = noop;
    });
  };

  consoleOverrides();

  // Detect debugger
  setInterval(() => {
    debugger;
  }, 100);
};

function App() {
  const [user, loading] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    secureApp();
    
    // Additional protection against dev tools
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = 'Dev tools detected!';
      }
    };

    window.addEventListener('resize', detectDevTools);
    return () => window.removeEventListener('resize', detectDevTools);
  }, []);

  useEffect(() => {
    if (!loading && isInitialLoad) {
      const minLoadTime = 2000;
      const loadStartTime = Date.now();
      
      const remainingTime = Math.max(0, minLoadTime - (Date.now() - loadStartTime));
      
      setTimeout(() => {
        setShowLoading(false);
        setIsInitialLoad(false);
      }, remainingTime);
    }
  }, [loading, isInitialLoad]);

  if (loading || showLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <Router>
        <Toaster />
        <div className="h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
          {user && <Header currentUser={user} />}
          <Routes>
            <Route
              path="/"
              element={user ? <ChatWindow currentUser={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUp /> : <Navigate to="/" />}
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/admin"
              element={user ? <AdminPage /> : <Navigate to="/login" />}
            />
            <Route 
              path="/error" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-red-600">
                  <div className="text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                    <p>Developer tools are not allowed on this site.</p>
                  </div>
                </div>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Prevent component modification
Object.freeze(App);
export default App; 