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

      const userIds = [...new Set(messageList.map(msg => msg.senderId))];
      const userDataPromises = userIds.map(async userId => {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        return { userId, ...userDocSnap.data() };
      });
      
      const users = await Promise.all(userDataPromises);
      const userDataMap = {};
      users.forEach(user => {
        userDataMap[user.userId] = user;
      });
      setUserData(userDataMap);
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
    <div className="flex flex-col h-screen pt-24">
      <div className="bg-gradient-to-r from-blue-900/90 to-blue-800/90 dark:from-slate-900/90 dark:to-slate-800/90 text-white p-3 rounded-b-2xl shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-lg font-bold">Public Chat Room</h2>
            <p className="text-xs text-blue-200/80 dark:text-slate-300/80">Messages are kept for 12 hours</p>
          </div>
        </div>
      </div>
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-3 space-y-2 max-w-5xl mx-auto w-full transition-colors duration-300"
        onScroll={handleScroll}
      >
        <MessageList 
          messages={messages} 
          currentUser={currentUser} 
          userData={userData}
          formatTime={formatMessageTime} 
        />
        <div ref={messagesEndRef} />
      </div>
      {!isNearBottom && unreadCount > 0 && (
        <div 
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 text-sm"
          onClick={scrollToBottom}
        >
          <span className="animate-bounce">↓</span>
          <span>{unreadCount} new message{unreadCount > 1 ? 's' : ''}</span>
        </div>
      )}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-colors duration-300">
        {isOnCooldown && (
          <div className="bg-red-500/10 text-red-600 dark:text-red-400 text-center mb-1.5 py-1 px-2 rounded-lg border border-red-200 dark:border-red-500/20 text-xs">
            <span className="font-medium">Slow down!</span>
            <span className="ml-1.5">Please wait {cooldownTime}s</span>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-1.5">
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
  );
};

export default ChatWindow; 