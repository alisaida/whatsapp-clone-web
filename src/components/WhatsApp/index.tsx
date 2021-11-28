import React, { useEffect, useState } from 'react';
import './styles.css';
import ChatList from '../ChatList/index'
import ChatRoomView from '../ChatRoomView/index';

import { getUser } from '../../graphql/queries';
import { getUserChatRooms } from '../../graphql/custom-queries';
import { onUpdateChatRoom } from '../../graphql/subscriptions';
import { User, ChatRoom, ChatRoomUser, Message } from '../../../types';

import { Auth, API, graphqlOperation } from 'aws-amplify'

const WhatsApp = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<Array<ChatRoom>>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>();

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
        chatRoomUser: (item.chatRoom.chatRoomUser as any).items,
      })).sort(sortDescending);

      setChatRooms(chatRooms);
      // if (chatRooms.length > 0) {
      //   setSelectedChatRoomId(chatRooms[chatRooms.length - 1].id);
      // }
    }

    fetchChatList();
  }, [])

  const sortDescending = (a: ChatRoom, b: ChatRoom): number => {
    return (new Date(a.updatedAt).valueOf() - new Date(b.updatedAt).valueOf());
  }

  //subscribe to onUpdateChatRoom
  useEffect(() => {
    const subscription: any = (API.graphql(graphqlOperation(onUpdateChatRoom)) as any)
      .subscribe({
        next: (data: any) => {
          const subscriptionData = data.value.data;

          const updatedChatRoom: ChatRoom = {
            id: subscriptionData.onUpdateChatRoom.id,
            chatRoomUser: subscriptionData.onUpdateChatRoom.chatRoomUser.items,
            updatedAt: subscriptionData.onUpdateChatRoom.updatedAt,
            messages: subscriptionData.onUpdateChatRoom.messages,
            lastMessage: subscriptionData.onUpdateChatRoom.lastMessage,
            lastMessageID: subscriptionData.onUpdateChatRoom.lastMessageID
          };

          //check if currentUser is a recipient of chatRoom
          console.log(updatedChatRoom.chatRoomUser);

          const isRecipient = updatedChatRoom.chatRoomUser.find(
            (recipient: ChatRoomUser) => recipient.userID === currentUser?.id
          );

          if (!isRecipient)
            return;

          let cloneChats: Array<ChatRoom> = [...chatRooms];

          const updateChatRoomIdx = cloneChats.findIndex(
            (chatRoom: ChatRoom) => chatRoom.id === updatedChatRoom.id
          );

          if (updateChatRoomIdx !== -1 && cloneChats.length > 1) {
            cloneChats.splice(updateChatRoomIdx, 1);
            setChatRooms([...cloneChats, updatedChatRoom]);

            //refresh??

          }

          return () => subscription.unsubscribe();

        }
      });

  }, [chatRooms]);

  //clean up
  useEffect(() => {
    return () => { };
  });

  const setSelectedChatRoom = (newChatRoomId: any) => {
    setSelectedChatRoomId(newChatRoomId);
  }

  return (
    <div className="whatsapp">
      <div className="whatsapp__body">
        {currentUser && chatRooms &&
          <ChatList
            currentUser={currentUser}
            chatRooms={chatRooms}
            updateChatRoomId={(newChatRoomId: any) => setSelectedChatRoom(newChatRoomId)}
          />
        }
        {currentUser && selectedChatRoomId && <ChatRoomView chatRoomId={selectedChatRoomId} currentUser={currentUser} key={selectedChatRoomId} />}
      </div>
    </div>
  );
}

export default WhatsApp;
