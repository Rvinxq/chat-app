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
        placeholder="Type a message..."
        className="flex-1 h-10 md:h-12 px-3 md:px-4 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        disabled={disabled}
      />
      <button
        type="submit"
        className={`h-10 md:h-12 w-10 md:w-12 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          disabled 
            ? 'bg-gray-300 dark:bg-gray-700' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
        disabled={disabled}
      >
        <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-90" />
      </button>
    </form>
  );
};

export default MessageInput; 