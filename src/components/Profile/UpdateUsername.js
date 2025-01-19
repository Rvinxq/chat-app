import { getDoc, doc, writeBatch } from 'firebase/firestore';

const handleUpdateUsername = async (newUsername) => {
  if (!newUsername.trim()) return;
  setError('');
  
  try {
    // Check if new username is available
    const usernameDoc = await getDoc(doc(db, 'usernames', newUsername.toLowerCase()));
    if (usernameDoc.exists()) {
      setError('Username is already taken');
      return;
    }

    const batch = writeBatch(db);
    
    // Delete old username reservation
    if (currentUsername) {
      batch.delete(doc(db, 'usernames', currentUsername.toLowerCase()));
    }

    // Create new username reservation
    batch.set(doc(db, 'usernames', newUsername.toLowerCase()), {
      uid: currentUser.uid,
      username: newUsername
    });

    // Update user document
    batch.update(doc(db, 'users', currentUser.uid), {
      username: newUsername
    });

    await batch.commit();
    setCurrentUsername(newUsername);
    setIsEditing(false);
    setUsername('');

  } catch (error) {
    console.error('Error updating username:', error);
    setError('Failed to update username: ' + error.message);
  }
}; 