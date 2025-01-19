import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={disabled ? "Cooldown active..." : "Type a message..."}
        className={`flex-1 rounded-xl border bg-white dark:bg-slate-700 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${disabled 
            ? 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400' 
            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100'
          }
          placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200`}
        disabled={disabled}
      />
      <button
        type="submit"
        className={`rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800
          ${disabled 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 active:from-blue-700 active:to-blue-800'
          } transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
        disabled={disabled}
      >
        <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
      </button>
    </form>
  );
};

export default MessageInput; 