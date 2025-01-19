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
                {message.type === 'text' && (
                  <p className="text-sm md:text-base break-words text-gray-800 dark:text-gray-200">
                    {message.content}
                  </p>
                )}
                {message.type === 'image' && (
                  <img 
                    src={message.content} 
                    alt="Shared" 
                    className="max-w-full rounded-lg"
                    loading="lazy"
                  />
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