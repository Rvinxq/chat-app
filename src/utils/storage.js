import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}; 