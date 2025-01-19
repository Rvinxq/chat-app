import React, { useState, useEffect } from 'react';
import { db, auth } from '../../utils/firebase';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';

const CreateGroup = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const usersList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.id !== auth.currentUser?.uid);
      setAvailableUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const groupData = {
        name: groupName,
        createdBy: auth.currentUser.uid,
        members: [...selectedUsers, auth.currentUser.uid],
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'groups'), groupData);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full p-2 border rounded"
            required
          />
          
          <div className="max-h-48 overflow-y-auto">
            {availableUsers.map(user => (
              <label key={user.id} className="flex items-center space-x-2 p-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                    }
                  }}
                />
                <span>{user.username}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create Group
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup; 