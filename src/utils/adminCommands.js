const ADMIN_EMAIL = 'SwarnabhaX@gmail.com';

export const isAdmin = (email) => {
  return email === ADMIN_EMAIL;
};

export const handleAdminCommand = async (command, currentUser, db) => {
  if (!isAdmin(currentUser?.email)) return null;

  const commands = {
    '/clear': async () => {
      const chatRef = collection(db, 'public-chat');
      const snapshot = await getDocs(chatRef);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return 'Chat cleared successfully';
    },
    
    '/online': async () => {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const onlineUsers = snapshot.docs.filter(doc => doc.data().isOnline).length;
      return `Currently online users: ${onlineUsers}`;
    }
  };

  const commandName = command.split(' ')[0].toLowerCase();
  const handler = commands[commandName];
  
  if (handler) {
    try {
      return await handler();
    } catch (error) {
      console.error('Admin command error:', error);
      return 'Command execution failed';
    }
  }
  
  return null;
}; 