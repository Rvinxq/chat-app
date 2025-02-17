import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, where, deleteDoc, getDocs } from 'firebase/firestore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';
import WelcomeModal from './WelcomeModal';
import { auth } from '../../utils/firebase';

const ChatWindow = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messageCountRef = useRef(0);
  const lastMessageTimeRef = useRef(Date.now());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Helper function to get timestamp from 12 hours ago
  const getTwelveHoursAgo = () => {
    const date = new Date();
    date.setHours(date.getHours() - 12);
    return date.toISOString();
  };

  // Clean up old messages
  const cleanupOldMessages = async () => {
    const twelveHoursAgo = getTwelveHoursAgo();
    const oldMessagesQuery = query(
      collection(db, 'public-chat'),
      where('timestamp', '<', twelveHoursAgo)
    );

    const snapshot = await getDocs(oldMessagesQuery);
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  useEffect(() => {
    const cleanup = setInterval(cleanupOldMessages, 3600000);
    return () => clearInterval(cleanup);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setUnreadCount(0);
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = chatContainerRef.current;
      const scrollPosition = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(scrollPosition < 100);
      
      if (isNearBottom) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    } else if (messages.length > messageCountRef.current) {
      // Only increment unread count if a new message is added, not when deleted
      setUnreadCount(prev => prev + 1);
    }
    messageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const twelveHoursAgo = getTwelveHoursAgo();
    const messagesQuery = query(
      collection(db, 'public-chat'),
      where('timestamp', '>=', twelveHoursAgo),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      // Handle both additions and deletions
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          if (!isNearBottom) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      });

      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);

      // Handle user data fetching separately
      const fetchUserData = async () => {
        const userIds = [...new Set(messageList.map(msg => msg.senderId))];
        const userDataPromises = userIds.map(async userId => {
          if (!userId) return null;
          const userDocRef = doc(db, 'users', userId);
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              return {
                userId,
                username: userDocSnap.data().username,
                ...userDocSnap.data()
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
          }
        });

        try {
          const users = (await Promise.all(userDataPromises)).filter(Boolean);
          const userDataMap = {};
          users.forEach(user => {
            if (user && user.userId) {
              userDataMap[user.userId] = user;
            }
          });
          setUserData(userDataMap);
        } catch (error) {
          console.error('Error processing user data:', error);
        }
      };

      fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  const startCooldown = () => {
    setIsOnCooldown(true);
    setCooldownTime(10);
    
    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsOnCooldown(false);
          messageCountRef.current = 0;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkSpam = () => {
    const now = Date.now();
    const timeDiff = now - lastMessageTimeRef.current;
    
    // If messages are sent too quickly
    if (timeDiff < 1000) { // Less than 1 second between messages
      messageCountRef.current += 1;
      
      // If user has sent too many messages too quickly
      if (messageCountRef.current >= 3) { // 3 rapid messages trigger timeout
        startCooldown();
        return true;
      }
    } else {
      // Reset counter if messages are sent at normal speed
      messageCountRef.current = 0;
    }
    
    lastMessageTimeRef.current = now;
    return false;
  };

  const handleSendMessage = async (message) => {
    if (isOnCooldown) {
      return;
    }

    if (checkSpam()) {
      return;
    }

    const messageData = {
      content: message,
      type: 'text',
      senderId: currentUser.uid,
      timestamp: new Date().toISOString()
    };

    await addDoc(collection(db, 'public-chat'), messageData);
  };

  const handleFileUpload = async (fileUrl) => {
    if (isOnCooldown) {
      return;
    }

    if (checkSpam()) {
      return;
    }

    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)/i);
    const messageData = {
      content: fileUrl,
      type: isImage ? 'image' : 'video',
      senderId: currentUser.uid,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'public-chat'), messageData);
    } catch (error) {
      console.error('Error sending file message:', error);
      alert('Failed to send file. Please try again.');
    }
  };

  useEffect(() => {
    chatContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => chatContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, [isNearBottom]);

  useEffect(() => {
    // Check if user has seen the welcome message
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col bg-transparent pt-14 sm:pt-16 relative z-10">
        {/* Header */}
        <div className="fixed top-14 sm:top-16 left-0 right-0 px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 shadow-sm z-40">
          <h2 className="text-base sm:text-lg font-semibold">Public Chat</h2>
          <p className="text-[10px] sm:text-xs text-gray-500">Messages are end-to-end encrypted</p>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-3 mb-[120px] sm:mb-[140px]"
          >
            <MessageList 
              messages={messages} 
              currentUser={currentUser}
              userData={userData}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* New messages indicator */}
          {!isNearBottom && unreadCount > 0 && (
            <div className="fixed bottom-[130px] sm:bottom-[150px] left-0 right-0 flex justify-center z-40">
              <div 
                onClick={scrollToBottom}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 animate-bounce-soft flex items-center space-x-2 group z-40"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative flex items-center space-x-2">
                  <span className="text-sm font-medium">New messages</span>
                  <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                    {unreadCount}
                  </span>
                  
                  {/* Arrow icon */}
                  <svg 
                    className="w-4 h-4 animate-bounce-slow" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Input area - fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-2 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
            <div className="max-w-4xl mx-auto space-y-2">
              <FileUpload 
                onFileUpload={handleFileUpload} 
                disabled={isOnCooldown}
              />
              <MessageInput 
                onSendMessage={handleSendMessage} 
                disabled={isOnCooldown}
                cooldownTime={cooldownTime}
              />
            </div>
          </div>
        </div>
      </div>
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
    </>
  );
};

export default ChatWindow; 