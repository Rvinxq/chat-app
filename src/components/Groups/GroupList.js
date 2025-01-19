import React, { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const GroupList = ({ onGroupSelect }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groupsQuery = query(collection(db, 'groups'));
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groupsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(groupsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-2">
      {groups.map(group => (
        <div
          key={group.id}
          onClick={() => onGroupSelect(group)}
          className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <p className="font-medium">{group.name}</p>
          <p className="text-sm text-gray-500">{group.members.length} members</p>
        </div>
      ))}
    </div>
  );
};

export default GroupList; 