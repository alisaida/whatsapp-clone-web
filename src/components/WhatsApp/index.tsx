import React from 'react';
import './styles.css';
import ChatList from '../ChatList/index'
import ChatRoom from '../ChatRoom/index';

const WhatsApp = () => {

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
