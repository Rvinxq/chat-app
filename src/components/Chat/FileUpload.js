import React from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import { uploadToCloudinary } from '../../utils/cloudinary';

const FileUpload = ({ onFileUpload, disabled }) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileUrl = await uploadToCloudinary(file);
        onFileUpload(fileUrl);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div className="flex items-center">
      <label className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl cursor-pointer text-xs font-medium
        ${disabled 
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
        } transition-all duration-200`}>
        <PaperClipIcon className="h-4 w-4" />
        <span>Attach Files</span>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default FileUpload; 