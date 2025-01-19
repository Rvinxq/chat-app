import React, { useMemo } from 'react';

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

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        // Add debug log for each message
        console.log('Message sender:', message.senderId, 'User data:', userData?.[message.senderId]);
        
        return (
          <div key={message.id} className="flex justify-start">
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
  );
};

export default MessageList; 