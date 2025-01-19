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

const MessageList = ({ messages, currentUser, userData, formatTime }) => {
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
    <div className="space-y-2 text-sm">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <span className={`font-medium ${userColors.get(message.senderId) || 'text-gray-600 dark:text-gray-400'} hover:opacity-75 transition-opacity duration-150`}>
              {userData[message.senderId]?.username || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>
          
          <div className="mt-0.5 pl-1">
            {message.type === 'text' && (
              <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
            )}
            {message.type === 'image' && (
              <img
                src={message.content}
                alt="Shared image"
                className="max-w-xs rounded-lg shadow-md"
              />
            )}
            {message.type === 'video' && (
              <video controls className="max-w-xs rounded-lg shadow-md">
                <source src={message.content} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList; 