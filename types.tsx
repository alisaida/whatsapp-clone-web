export type User = {
    id: string;
    name: string;
    imageUri: string;
    status: string;
    username: string;
}

export type Message = {
    id: string;
    message: string;
    createdAt: string;
    userID: string;
    chatRoomID: string;
    imageUri: string;
    user: User;
    chatRoom: ChatRoom;
}

export type ChatRoom = {
    id: string;
    chatRoomUser: User[];
    messages: Message[];
    lastMessageID: string;
    lastMessage: Message;
    updatedAt: string;
}

export type ChatRoomUser = {
    id: string;
    userID: string;
    chatRoomID: string;
    updatedAt: string;
    user: User;
    chatRoom: ChatRoom
}