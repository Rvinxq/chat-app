import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, where, deleteDoc, getDocs } from 'firebase/firestore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import FileUpload from './FileUpload';

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
    // Run cleanup every hour
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
    } else {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages]);

  useEffect(() => {
    const twelveHoursAgo = getTwelveHoursAgo();
    const messagesQuery = query(
      collection(db, 'public-chat'),
      where('timestamp', '>=', twelveHoursAgo),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);

      // Fetch user data for all unique senders
      try {
        const userIds = [...new Set(messageList.map(msg => msg.senderId))];
        const userDataPromises = userIds.map(async userId => {
          if (!userId) return null;
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          return userDocSnap.exists() ? { userId, ...userDocSnap.data() } : null;
        });
        
        const users = (await Promise.all(userDataPromises)).filter(Boolean);
        const userDataMap = {};
        users.forEach(user => {
          if (user && user.userId) {
            userDataMap[user.userId] = user;
          }
        });
        setUserData(userDataMap);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

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

    const messageData = {
      content: fileUrl,
      type: fileUrl.includes('/image/') ? 'image' : 'video',
      senderId: currentUser.uid,
      timestamp: new Date().toISOString()
    };

    await addDoc(collection(db, 'public-chat'), messageData);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900 pt-14 sm:pt-16">
      {/* Header */}
      <div className="fixed top-14 sm:top-16 left-0 right-0 px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 shadow-sm z-40">
        <h2 className="text-base sm:text-lg font-semibold">Public Chat</h2>
        <p className="text-[10px] sm:text-xs text-gray-500">Messages are end-to-end encrypted</p>
      </div>

      {/* Messages area - adjusted top padding to account for fixed header */}
      <div className="flex-1 overflow-hidden flex flex-col mt-14 sm:mt-16">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-3"
          onScroll={handleScroll}
        >
          <MessageList 
            messages={messages} 
            currentUser={currentUser}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* New messages indicator */}
        {!isNearBottom && unreadCount > 0 && (
          <div 
            onClick={scrollToBottom}
            className="fixed bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 z-40 flex items-center space-x-2 text-xs sm:text-sm"
          >
            <span>New messages</span>
            <span className="bg-white text-blue-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-medium">
              {unreadCount}
            </span>
          </div>
        )}

        {/* Input area */}
        <div className="p-2 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto space-y-2">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              disabled={isOnCooldown}
            />
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={isOnCooldown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 