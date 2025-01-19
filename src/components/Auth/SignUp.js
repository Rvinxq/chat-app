import React, { useState } from 'react';
import { auth, db } from '../../utils/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (email, password, username) => {
    setLoading(true);
    setError('');

    // Check email domain
    const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com'];
    const emailDomain = email.split('@')[1].toLowerCase();
    
    if (!allowedDomains.includes(emailDomain)) {
      setError('Only Gmail, Outlook, and Hotmail accounts are allowed');
      setLoading(false);
      return;
    }

    try {
      // Check if username exists
      const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      if (usernameDoc.exists()) {
        setError('Username is already taken');
        setLoading(false);
        return;
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user, {
        url: window.location.origin + '/verify-email',
        handleCodeInApp: true,
      });

      // Show toast notification
      toast.success('Verification email sent! Please check your inbox.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
        },
      });

      // Create user document with verification status
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
        emailVerified: false
      });

      // Reserve username
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid,
        username: username
      });

      setVerificationSent(true);

    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message);
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError('Please fill in all fields');
      return;
    }

    handleSignUp(email, password, username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      <div className="max-w-md w-full mx-4">
        {verificationSent ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <div className="text-center space-y-6">
              {/* Email Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                <p className="text-blue-100">
                  We've sent a verification link to:
                </p>
                <p className="text-lg font-medium text-blue-200">
                  {email}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-sm text-blue-100">
                  Click the link in the email to verify your account. If you don't see the email, check your spam folder.
                </p>

                <button 
                  onClick={() => sendEmailVerification(auth.currentUser)}
                  className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl transition-all duration-200 border border-blue-400/30"
                >
                  Resend Verification Email
                </button>

                <div className="pt-4 text-sm text-blue-200/80">
                  <Link to="/login" className="hover:text-blue-200 underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-blue-100/80">Join ChatBuddy today</p>
            </div>
            
            <div className="bg-white p-8 rounded-t-3xl shadow-inner">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp; 