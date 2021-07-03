import React, { useEffect, useState } from 'react';
import './styles.css';

import { Message, User } from '../../../types';

import { API, Storage, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../gql/graphql/queries';

import moment from 'moment';

export type MessageListItemProps = {
    message: Message,
    separatorDate: string,
    currentUser: User
}

const MessageListItem = (props: MessageListItemProps) => {

    const { message, separatorDate, currentUser } = props;
    const [imageUri, setImageUri] = useState('');

    const [sender, setSender] = useState<User | null>();

    useEffect(() => {
        const fetchUser = async () => {
            const userData: any = await API.graphql(graphqlOperation(getUser, { id: message.userID }));

            const sender: User = {
                id: userData.data.getUser.id,
                name: userData.data.getUser.name,
                imageUri: userData.data.getUser.imageUri,
                username: userData.data.getUser.username,
                status: userData.data.getUser.status
            }

            setSender(sender);
        }

        fetchUser();
    }, []);

    const getUri = async () => {
        const signedURL: any = await Storage.get(message.imageUri, {
        });
        if (signedURL) {
            setImageUri(signedURL);
        }
    }

    if (message.imageUri) {
        getUri();
    }

    if (!sender)
        return null;

    const messageClassName = (sender.id != currentUser.id) ? 'chat__message' : 'chat__message chat__sender';

    return (
        <>

            {
                (separatorDate != '') && <div className='chat__date_separator'>{separatorDate}</div>
            }

            <div>
                <p className={messageClassName}>
                    {/* {sender && <span className='chat__name'>{sender.name}</span>} */}
                    {/* {recipientUser && <img src={(recipientUser as any).imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} alt='profile picture' className='sidebar__profilePicture'/>} */}
                    {imageUri && <><img className="msgImage" src={imageUri} onError={(e) => ((e.target as HTMLElement).onerror = null)} height={400} width={300} /> <br /></>}
                    {message.message}
                    <span className="chat__time">{moment(message.createdAt).format('LT')}</span>
                </p>
            </div>
        </>
    )
}

export default MessageListItem;