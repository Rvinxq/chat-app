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
      <label className="flex items-center space-x-2 px-3 h-8 md:h-10 rounded-full text-xs md:text-sm bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors">
        <PaperClipIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Attach</span>
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