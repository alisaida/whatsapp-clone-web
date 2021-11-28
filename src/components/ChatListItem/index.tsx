import React, { useState, useEffect } from 'react';
import './styles.css';
// import { Avatar } from '@material-ui/core';
import { DoneAll, PhotoCamera } from '@material-ui/icons';

import { ChatRoom, User } from '../../../types'
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../graphql/queries';

import { timeAgo } from '../../DateUtil/DateUtil';

export type ChatListItemProps = {
    chatRoom: ChatRoom,
    currentUser: User,
    updateChatRoomId: any
}

const ChatListItem = (props: ChatListItemProps) => {

    const { chatRoom, currentUser, updateChatRoomId } = props;
    const [recipientUser, setRecipientUser] = useState<User | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        setupRecipient();
    }, [])

    const setupRecipient = async () => {

        const users: Array<any> = chatRoom.chatRoomUser;

        let recipientUserID: string;
        if (users[0].userID === currentUser.id) {
            recipientUserID = users[1].userID;
        } else {
            recipientUserID = users[0].userID;
        }

        try {
            const recipientData: any = await API.graphql(graphqlOperation(getUser, { id: recipientUserID }));

            const recipient: User = {
                id: recipientData.data.getUser.id,
                name: recipientData.data.getUser.name,
                imageUri: recipientData.data.getUser.imageUri,
                username: recipientData.data.getUser.username,
                status: recipientData.data.getUser.status
            }

            setRecipientUser(recipient);

        } catch (e) {
            console.log(e);
        }
    }

    const lastMessageDisplay = () => {
        // console.log(chatRoom.lastMessage.imageUri)
        const isEmptyTxt: boolean = chatRoom.lastMessage.message === '';
        const hasPhoto: boolean = chatRoom.lastMessage.imageUri != null;
        const isSent: boolean = chatRoom.lastMessage.userID === currentUser.id;

        //isRead
        // {isSending && <DoneAll style={{ fontSize: 15, color: 'green' }} />}
        return (
            <div className="lastMessage__content">{isSent && <DoneAll style={{ fontSize: 15, color: 'gray' }} />}
                {hasPhoto && <PhotoCamera style={{ fontSize: 15, color: 'gray' }} />}
                <p>{(isEmptyTxt && hasPhoto) ? 'Photo' : chatRoom.lastMessage.message}</p>
            </div>);
    }

    const updateSelectedChatRoom = () => {
        updateChatRoomId(chatRoom.id);
        setIsActive(true);
    }

    const chatInfoClassName = isActive ? 'sidebarChat active__chat' : 'sidebarChat';

    console.log(chatInfoClassName);

    return (
        <div className="sidebarChat" onClick={updateSelectedChatRoom}>
            {/* <Avatar src="" /> */}
            {recipientUser && <img src={(recipientUser as any).imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} alt='profile picture' className='recipient__profilePicture' />}
            <div className="sidebarChat__info">
                <h4>{recipientUser && recipientUser.name}</h4>
                <div className="sideBarChat__lastMessage">
                    {lastMessageDisplay()}
                    <span className="lastMessage__time">{timeAgo(chatRoom.lastMessage.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;