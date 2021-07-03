import React from 'react';
import './styles.css';
import ChatListItem from '../ChatListItem/index'

import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';

import { ChatRoom, ChatRoomUser, User } from '../../../types';
import { updateChatRoom } from '../../gql/graphql/mutations';

export type ChatListProps = {
    currentUser: User,
    chatRooms: Array<ChatRoom>,
    updateChatRoomId: any
}

const ChatList = (props: ChatListProps) => {

    const { currentUser, chatRooms, updateChatRoomId } = props;

    const sortDescending = (a: any, b: any): number => {
        if (!a.updatedAt)
            return -1;
        else if (!b.updatedAt)
            return 1;

        return a.updatedAt.localeCompare(b.updatedAt);
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                {/* <Avatar src='' /> */}
                {currentUser && <img src={(currentUser as any).imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} alt='profile picture' className='sidebar__profilePicture' />}
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <MessageIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            {/* search bar */}
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start a new chat" type="text" />
                </div>
            </div>
            {/* side bar chats */}
            <div className="sidebar__chats">
                {
                    chatRooms.map((item) => {
                        return (
                            <ChatListItem
                                chatRoom={item} key={(item as ChatRoom).id}
                                currentUser={currentUser}
                                updateChatRoomId={(newChatRoomId: any) => { updateChatRoomId(newChatRoomId) }}
                            />
                        )
                    })//.sort(sortDescending)
                }
            </div>
        </div>
    );
}

export default ChatList;