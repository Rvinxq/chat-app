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

function App() {
  const [user, loading] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 