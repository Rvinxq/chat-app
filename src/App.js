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
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });

  // Disable source view
  document.addEventListener('keypress', (e) => {
    if (e.ctrlKey && e.key === 'u') e.preventDefault();
  });

  // Clear console
  console.clear();
  
  // Disable console in production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
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