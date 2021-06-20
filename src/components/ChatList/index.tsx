import React, { useEffect, useState } from 'react';
import './styles.css';
import ChatListItem from '../ChatListItem/index'

import MessageIcon from '@material-ui/icons/Message';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons'


import { getUser } from '../../gql/graphql/queries';
import { getUserChatRooms } from '../../gql/graphql/custom-queries';
import { User, ChatRoom, ChatRoomUser } from '../../../types';

import { Auth, API, graphqlOperation } from 'aws-amplify'

const ChatList = () => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUserData = await Auth.currentAuthenticatedUser();

            const userID = currentUserData.attributes.sub;

            const userData: any = await API.graphql(graphqlOperation(getUser,
                {
                    id: userID
                }
            ));

            const user: User = {
                id: userData.data.getUser.id,
                name: userData.data.getUser.name,
                imageUri: userData.data.getUser.imageUri,
                status: userData.data.getUser.status,
                username: userData.data.getUser.status
            }

            setCurrentUser(user);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchChatList = async () => {
            const currentUserData = await Auth.currentAuthenticatedUser();
            const userID = currentUserData.attributes.sub;

            const chatRoomsData: any = await API.graphql(graphqlOperation(getUserChatRooms,
                {
                    id: userID
                }
            ));

            const chatRooms = chatRoomsData.data.getUser.chatRoomUsers.items.map((item: ChatRoomUser) => ({
                id: item.chatRoom.id,
                lastMessage: item.chatRoom.lastMessage,
                updatedAt: item.chatRoom.updatedAt,
                chatRoomUser: (item.chatRoom.chatRoomUser as any).items
            }));

            setChatRooms(chatRooms)
        }

        fetchChatList();
    }, [])

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
                {/* <ChatListItem chatRooms={chatRooms} /> */}
                {
                    chatRooms.map(item => {
                        return <ChatListItem chatRoom={item} key={(item as ChatRoom).id} />
                    })
                }
            </div>
        </div>
    );
}

export default ChatList;