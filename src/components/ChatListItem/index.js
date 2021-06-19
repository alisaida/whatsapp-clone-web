import React from 'react';
import './styles.css';
import { Avatar } from '@material-ui/core';

const ChatListItem = () => {
    return (
        <div className="sidebarChat">
            <Avatar src="" />
            <div className="sidebarChat__info">
                <h2>Jim</h2>
                <p>Hello world</p>
            </div>
        </div>
    );
}

export default ChatListItem;