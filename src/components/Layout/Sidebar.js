import React, { useState, useEffect } from 'react';
import { auth, db } from '../../utils/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const Sidebar = ({ onChatSelect }) => {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    // Fetch contacts
    const contactsQuery = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(contactsQuery, (snapshot) => {
      const contactsList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.id !== auth.currentUser?.uid);
      setContacts(contactsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <div className="flex mb-4">
        <button
          className={`flex-1 p-2 ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
        <button
          className={`flex-1 p-2 ${activeTab === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
      </div>

      {activeTab === 'contacts' ? (
        <div className="space-y-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => onChatSelect({ type: 'contact', data: contact })}
              className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">{contact.username}</p>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => onChatSelect({ type: 'group', data: group })}
              className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">{group.name}</p>
              <p className="text-sm text-gray-500">{group.memberCount} members</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 