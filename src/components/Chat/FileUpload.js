import React, { useRef } from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import { uploadToCloudinary } from '../../utils/cloudinary';

const FileUpload = ({ onFileUpload, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please upload only images or videos');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    try {
      const fileUrl = await uploadToCloudinary(file);
      if (fileUrl) {
        onFileUpload(fileUrl);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="flex items-center">
      <label className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg
        ${disabled 
          ? 'bg-gray-100 cursor-not-allowed' 
          : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
        }
        dark:bg-gray-700 dark:hover:bg-gray-600
        transition-colors duration-200
      `}>
        <PaperClipIcon className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Attach
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload; 