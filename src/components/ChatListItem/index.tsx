import React, { useState, useEffect } from 'react';
import './styles.css';
import { Avatar } from '@material-ui/core';


import { ChatRoom, User } from '../../../types'
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../gql/graphql/queries';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = (props: ChatListItemProps) => {

    const { chatRoom } = props;
    const [currentUserID, setCurrentUserID] = useState(null);
    const [recipientUser, setRecipientUser] = useState<User | null>(null);

    useEffect(() => {

        const fetchCurrentUser = async () => {
            const userData = await Auth.currentAuthenticatedUser();
            setCurrentUserID(userData.attributes.sub);
        };

        fetchCurrentUser();

        setupRecipient();
    }, [])

    const setupRecipient = async () => {

        const users: Array<any> = chatRoom.chatRoomUser;

        let recipientUserID: string;
        if (users[0].userID === currentUserID) {
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

    return (
        <div className="sidebarChat">
            {/* <Avatar src="" /> */}
            {recipientUser && <img src={(recipientUser as any).imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} alt='profile picture' className='recipient__profilePicture' />}
            <div className="sidebarChat__info">
                <h2>{recipientUser && recipientUser.name}</h2>
                <p>{chatRoom.lastMessage && chatRoom.lastMessage.message}</p>
            </div>
        </div>
    );
}

export default ChatListItem;