import React from 'react';
import './styles.css';
import { Avatar, IconButton } from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import MicIcon from '@material-ui/icons/Mic';

const ChatRoom = () => {
    return (
        <div className="chat">
            {/* chat header */}
            <div className="chat__header">
                <Avatar src="" />
                <div className="chat__headerInfo">
                    <h3>Jim</h3>
                    <p>Lass seen Friday, 18 June 2021 </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton><SearchIcon /></IconButton>
                    <IconButton><AttachFileIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>
            <div className="chat__body">
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message chat__receiver">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message chat__receiver">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message chat__receiver">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message chat__receiver">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
                <p className="chat__message">
                    <span className="chat__name">Sonny</span>
                    Hello World!
                    <span className="chat__time">{new Date().toUTCString()}</span>
                </p>
            </div>
            {/* chat input */}
            <div className="chat__footer">
                <IconButton><EmojiEmotionsIcon /></IconButton>
                <form>
                    <input type="text" placeholder="type a message" />
                    <button type="submit">Send a message</button>
                </form>
                <IconButton><MicIcon /></IconButton>
            </div>
        </div>
    );
}

export default ChatRoom;