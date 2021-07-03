import React, { useEffect, useState } from 'react';
import './styles.css';
import { Avatar, IconButton, CircularProgress } from '@material-ui/core';
import { Send, Mic, AttachFile, MoreVert, EmojiEmotions, Search } from '@material-ui/icons';


import { ChatRoom, ChatRoomUser, User } from '../../../types';
import MessageListItem from '../MessageListItem';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getChatRoom, getUser } from '../../gql/graphql/queries';
import { createMessage, updateChatRoom } from '../../gql/graphql/mutations';
import { onCreateMessage } from '../../gql/graphql/subscriptions';
import { Message } from '../../../types';

import moment from 'moment';

export type ChatRoomProps = {
    chatRoomId: string,
    currentUser: User,
}

const ChatRoomView = (props: ChatRoomProps) => {

    const { chatRoomId, currentUser } = props

    const [chatRoom, setChatRoom] = useState<ChatRoom | null>();
    const [messageList, setMessageList] = useState<Array<Message>>([]);
    const [recipientUser, setRecipientUser] = useState<User | null>();
    const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const fetchRecipient = async (chatRoom: any) => {

        let recipientUserId;
        let recipients: any = (chatRoom as any).chatRoomUser.items

        if (recipients[0].userID === currentUser.id) {
            recipientUserId = recipients[1].userID;
        } else {
            recipientUserId = recipients[0].userID;
        }

        try {
            const userData: any = await API.graphql(graphqlOperation(getUser,
                {
                    id: recipientUserId
                }
            ));

            const user: User = {
                id: userData.data.getUser.id,
                name: userData.data.getUser.name,
                imageUri: userData.data.getUser.imageUri,
                status: userData.data.getUser.status,
                username: userData.data.getUser.status
            }

            setMessageList(chatRoom.messages);
            setChatRoom(chatRoom);
            setRecipientUser(user);
            setFinishedLoading(true);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const chatRoomData: any = await API.graphql(graphqlOperation(getChatRoom, {
                    id: chatRoomId
                }));

                const chatRoom: ChatRoom = {
                    id: chatRoomData.data.getChatRoom.id,
                    chatRoomUser: chatRoomData.data.getChatRoom.chatRoomUser,
                    messages: (chatRoomData.data.getChatRoom.messages as any).items,
                    lastMessage: chatRoomData.data.getChatRoom.lastMessage,
                    lastMessageID: chatRoomData.data.getChatRoom.lastMessageID,
                    updatedAt: chatRoomData.data.getChatRoom.updatedAt
                }

                fetchRecipient(chatRoom);

            } catch (e) {
                console.log(e);
            }
        }

        fetchChatRoom();
    }, [])

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    }

    const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }

    }

    const sendTextMessage = async () => {
        try {
            const lastMessage = await API.graphql(graphqlOperation(createMessage, {
                input: {
                    chatRoomID: chatRoomId,
                    userID: currentUser.id,
                    message: message
                }
            }));

            const lastMessageID = (lastMessage as any).data.createMessage.id;
            await API.graphql(graphqlOperation(updateChatRoom, {
                input: {
                    id: chatRoomId,
                    lastMessageID: lastMessageID
                }
            }));

        } catch (error) {
            console.log(error)
        }
    }

    const sendVoiceMessage = (): void => {

    }

    const handleSend = (): void => {
        if (message) {
            sendTextMessage();
        } else {
            sendVoiceMessage();
        }
        setMessage('');
    }

    useEffect(() => {
        const subscription: any = (API.graphql(graphqlOperation(onCreateMessage)) as any)
            .subscribe({
                next: (data: any) => {
                    const subscriptionData = data.value.data;
                    const newMessageData: Message = subscriptionData.onCreateMessage;
                    //check if message was intended for this chatRoom
                    if (newMessageData.chatRoomID != chatRoomId) {
                        return;
                    }

                    const updatedMessageList = [...messageList, newMessageData];
                    setMessageList(updatedMessageList);

                }
            });

        return () => subscription.unsubscribe();
    }, [messageList]);

    useEffect(() => {
        return () => {
            // console.log("cleaned up");
        };
    }, []);

    const sortAscending = (a: any, b: any): number => {
        if (!a.createdAt)
            return 1;
        else if (!b.createdAt)
            return -1;

        return a.createdAt.localeCompare(b.createdAt);
    }

    const separatorDate = (index: number): string => {
        let prevDate = '';
        if (index > 0) {
            prevDate = moment(messageList[index - 1].createdAt).format();
        } else {
            prevDate = moment(messageList[index].createdAt).format();
        }

        let current = moment(messageList[index].createdAt).format();
        let currentDateFormated = moment(messageList[index].createdAt).format('LL');

        if (index === 0 || (prevDate && !moment(current).isSame(prevDate, 'day'))) {
            return currentDateFormated;
        } else {
            return '';
        }

    }

    return (
        <div className="chat">
            {/* chat header */}
            <div className="chat__header">
                {recipientUser && <img src={(recipientUser as any).imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} alt='profile picture' className='sidebar__profilePicture'
                />}
                <div className="chat__headerInfo">
                    <h4>{recipientUser?.name}</h4>
                    <p>Last seen Friday, 18 June 2021 </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton><Search /></IconButton>
                    <IconButton><AttachFile /></IconButton>
                    <IconButton><MoreVert /></IconButton>
                </div>
            </div>
            <div className="chat__body">
                {
                    finishedLoading ?
                        (messageList && messageList.map((item, index) => {
                            return <MessageListItem message={item} key={item.id} separatorDate={separatorDate(index)} currentUser={currentUser}

                            />
                        }).sort(sortAscending)
                        )
                        : (<CircularProgress />)
                }
            </div>
            {/* chat input */}
            <div className="chat__input">
                <IconButton><EmojiEmotions /></IconButton>
                <form  >
                    <input type="text" placeholder="type a message" onChange={handleMessageChange} value={message} onKeyDown={handleSubmit} />
                </form>

                {message ?
                    (<IconButton><Send style={{ color: 'white', backgroundColor: '#128C7E', borderRadius: '50%', padding: '3px' }} onClick={handleSend} /></IconButton>)
                    : (<IconButton><Mic style={{ color: 'white', backgroundColor: '#128C7E', borderRadius: '50%', padding: '3px' }} /></IconButton>)}
            </div>
        </div>
    );
}

export default ChatRoomView;