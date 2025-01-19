import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';
import LoadingScreen from './components/Layout/LoadingScreen';
import disableDevTools from './utils/devToolsProtection';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ChatWindow from './components/Chat/ChatWindow';
import Header from './components/Layout/Header';
import NotFound from './components/404/NotFound';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [user, loading] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    disableDevTools();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  }, [loading]);

  if (loading || showLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 