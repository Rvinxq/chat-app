import React, { useState, useEffect } from 'react';
import { auth, db } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Logo from './Logo';
import ThemeToggle from '../Theme/ThemeToggle';

const Header = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();
          setCurrentUsername(userData?.username || '');
        } catch (err) {
          console.error('Error fetching username:', err);
          setError('Failed to fetch username');
        }
      }
    };
    fetchUsername();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to logout');
    }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) return;
    setError('');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() || {};

      await setDoc(userRef, {
        ...userData,
        username: username.trim()
      }, { merge: true });

      setCurrentUsername(username);
      setIsEditing(false);
      setUsername('');
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username: ' + error.message);
    }
  };

  return (
    <div className="bg-transparent fixed top-0 left-0 right-0 p-4 z-50">
      <header className="max-w-[95%] mx-auto bg-light-surface/15 dark:bg-dark-surface/15 backdrop-blur-md rounded-2xl shadow-lg border border-light-border/30 dark:border-dark-border/30 px-6 py-3 animate-float">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 z-10">
            <Logo />
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {currentUser && (
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1.5 backdrop-blur-sm transition-all duration-300 border border-white/10">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="New username"
                      className="px-2 py-1 text-white rounded bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50 text-sm w-32"
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={handleUpdateUsername}
                        className="bg-emerald-500/50 hover:bg-emerald-500/70 px-2 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setError('');
                        }}
                        className="bg-rose-500/50 hover:bg-rose-500/70 px-2 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-sm">
                      {currentUsername || currentUser.email}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-500/30 hover:bg-indigo-500/50 px-2 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <div className="h-6 w-px bg-white/20"></div>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500/30 hover:bg-rose-500/50 px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 text-sm flex items-center space-x-1"
                >
                  <span>Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6a1 1 0 102 0V6zm-8 7a1 1 0 100 2h4a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-b-lg shadow-lg border border-red-400/50">
            {error}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header; 