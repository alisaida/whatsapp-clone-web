import React, { useState, useEffect } from 'react';
import './styles.css';
import ChatList from '../ChatList/index'
import ChatRoom from '../ChatRoom/index';
import { User } from '../../../types';

import { Auth } from 'aws-amplify'

const WhatsApp = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const userID = userData.attributes.sub;
      console.log(userData);
    }

    fetchUser();
  }, []);



  return (
    <div className="whatsapp">
      <div className="whatsapp__body">
        <ChatList />
        <ChatRoom />
      </div>
    </div>
  );
}

export default WhatsApp;
