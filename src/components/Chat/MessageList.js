import React, { useMemo, useState, useRef, useCallback } from 'react';
import { db } from '../../utils/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

// Array of visually distinct colors for usernames
const USERNAME_COLORS = [
  'text-pink-600',    // Pink
  'text-purple-600',  // Purple
  'text-indigo-600',  // Indigo
  'text-blue-600',    // Blue
  'text-cyan-600',    // Cyan
  'text-teal-600',    // Teal
  'text-green-600',   // Green
  'text-lime-600',    // Lime
  'text-amber-600',   // Amber
  'text-orange-600',  // Orange
  'text-red-600',     // Red
  'text-rose-600',    // Rose
  'text-fuchsia-600', // Fuchsia
  'text-emerald-600', // Emerald
  'text-sky-600',     // Sky
];

const MessageList = ({ messages, currentUser, userData }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const longPressTimer = useRef(null);
  const lastClickTime = useRef(0);
  const touchStartTime = useRef(0);

  const handleDelete = async (messageId) => {
    try {
      // Reference the specific message document
      const messageRef = doc(db, 'public-chat', messageId);
      
      // Add loading state
      toast.loading('Deleting message...');
      
      // Delete the message
      await deleteDoc(messageRef);
      
      // Show success message
      toast.dismiss(); // Remove loading toast
      toast.success('Message deleted successfully', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
        },
      });
      
      // Clear selection
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.dismiss(); // Remove loading toast
      toast.error('Failed to delete message. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
        },
      });
    }
  };

  const handleTouchStart = (message) => {
    touchStartTime.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      if (message.senderId === currentUser.uid) {
        setSelectedMessage(message);
      }
    }, 500); // 500ms for long press
  };

  const handleTouchEnd = () => {
    const pressDuration = Date.now() - touchStartTime.current;
    if (pressDuration < 500) {
      // If it was a short tap, clear the selection
      setSelectedMessage(null);
    }
    clearTimeout(longPressTimer.current);
  };

  const handleClick = (message) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime.current;

    if (timeDiff < 300 && message.senderId === currentUser.uid) { // 300ms for double click
      setSelectedMessage(message);
    }

    lastClickTime.current = currentTime;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  // Create a map of user IDs to colors
  const userColors = useMemo(() => {
    const colorMap = new Map();
    let colorIndex = 0;
    
    messages.forEach(message => {
      if (!colorMap.has(message.senderId)) {
        colorMap.set(message.senderId, USERNAME_COLORS[colorIndex % USERNAME_COLORS.length]);
        colorIndex++;
      }
    });
    
    return colorMap;
  }, [messages]);

  const renderMediaContent = (message) => {
    const isImage = message.type === 'image';
    
    return (
      <div className="space-y-2">
        {/* Media type label with hyperlink */}
        <a 
          href={message.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <span className="font-mono tracking-wider">
            {isImage ? '📷 Image' : '🎥 Video'}
          </span>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </a>

        {/* Media content */}
        {isImage ? (
          <img 
            src={message.content} 
            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            loading="lazy"
            onClick={() => window.open(message.content, '_blank')}
          />
        ) : (
          <video 
            src={message.content}
            controls
            className="max-w-full rounded-lg shadow-md"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  };

  // Add delete confirmation modal
  const renderDeleteModal = () => {
    if (!selectedMessage) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setSelectedMessage(null)}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm transform transition-all">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Message?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {messages.map((message) => {
          // Add debug log for each message
          console.log('Message sender:', message.senderId, 'User data:', userData?.[message.senderId]);
          
          return (
            <div 
              key={message.id} 
              className={`flex justify-start relative ${
                selectedMessage?.id === message.id ? 'bg-gray-100 dark:bg-gray-700 rounded-lg' : ''
              }`}
              onTouchStart={() => handleTouchStart(message)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleClick(message)}
              onContextMenu={(e) => e.preventDefault()} // Prevent context menu on mobile
            >
              <div className="max-w-[85%] md:max-w-[75%] px-1">
                {/* Time */}
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  {formatTime(message.timestamp)}
                </div>

                {/* Username */}
                <div className={`text-xs font-medium mb-1 ${userColors.get(message.senderId) || 'text-gray-600'}`}>
                  {userData?.[message.senderId]?.username || 'User'}
                </div>

                {/* Message Content */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {message.type === 'text' ? (
                    <p className="text-sm md:text-base break-words text-gray-800 dark:text-gray-200">
                      {message.content}
                    </p>
                  ) : (
                    renderMediaContent(message)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render delete confirmation modal */}
      {renderDeleteModal()}
    </>
  );
};

export default MessageList; 