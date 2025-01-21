import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { handleAdminCommand } from '../../utils/adminCommands';
import { db } from '../../utils/firebase';

const MessageInput = ({ onSendMessage, disabled, cooldownTime, currentUser }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      // Check for admin commands
      if (message.startsWith('/')) {
        const response = await handleAdminCommand(message, currentUser, db);
        if (response) {
          // Show admin command response
          onSendMessage(`System: ${response}`, 'system');
          setMessage('');
          return;
        }
      }
      
      // Regular message
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {disabled && cooldownTime > 0 && (
        <div className="absolute -top-12 left-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg text-sm text-center animate-fadeIn">
          Slow down! You can send messages again in {cooldownTime} seconds
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Timeout active..." : "Type a message..."}
          className={`flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            disabled ? 'text-red-500' : ''
          }`}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-90" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput; 