import { CloudinaryContext } from 'cloudinary-react';

const cloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
};

export const cloudinaryContext = CloudinaryContext;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default {
  uploadToCloudinary,
  cloudinaryConfig
}; 