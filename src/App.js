import React from 'react';
import './App.css';
import ChatList from './components/ChatList/index'
import ChatRoom from './components/ChatRoom/index';

const App = () => {
  return (
    <div className="app">
      <div className="app__body">
        <ChatList />
        <ChatRoom />
      </div>
    </div>
  );
}

export default App;
