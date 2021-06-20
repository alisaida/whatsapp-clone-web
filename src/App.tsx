import React, { useEffect, useState } from 'react';
import './App.css';
import WhatsApp from './components/WhatsApp/index';

import Amplify, { Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

import awsconfig from "./aws-exports";

import { User } from '../types'

awsconfig.oauth.redirectSignIn = 'http://localhost:3000/';
awsconfig.oauth.redirectSignOut = 'http://localhost:3000/';

Amplify.configure(awsconfig);

const App = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'federatedSignIn':
          checkAuthUser().then(userData => setUser(userData));
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    checkAuthUser().then(userData => setUser(userData));
  }, []);

  const checkAuthUser = async () => {
    //get Authenticated user from Auth
    const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

    if (userInfo) {
      console.log('found user info');
      //get the user from backend with SUB from Auth
      // const userData = await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }))

      //if there is not user in the DB with the id, then create one
      // if (userData.data.getUser) {
      //   return userInfo;
      // }

      console.log('New user detected! persisting user data');

      const newUser = {
        id: userInfo.attributes.sub,
        name: userInfo.attributes.given_name + ' ' + userInfo.attributes.family_name,
        username: userInfo.attributes.email,
        imageUri: userInfo.attributes.picture,
        status: 'Hey there! I am using Whatsapp.'
      };



      //format username:
      var username = newUser.username.substr(0, newUser.username.indexOf('@'));
      newUser.username = '@' + username;

      setUser(newUser);

      console.log(newUser);

      //save to DB
      // await API.graphql(graphqlOperation(createUser, { input: newUser }));
    } else {
      console.log('no user info found');
    }

    return userInfo;
  }

  const signOut = () => {
    Auth.signOut();
    setUser(null);
    const cognito_url = 'https://whatsappcloneb5b58018-b5b58018-dev.auth.ap-southeast-2.amazoncognito.com';
    const client_id = '7dialvudgptap7uuuqu5u84r29';
    const redirect_uri = 'http://localhost:3000/';
    // window.location = `${cognito_url}/logout?client_id=${client_id}&logout_uri=${redirect_uri}`;
    // fetch(`${cognito_url}/logout?client_id=${client_id}&logout_uri=${redirect_uri}`);
  }

  return (
    <div>
      {user ? (
        // <button onClick={() => signOut()}>Sign Out</button>
        <WhatsApp />
      ) : (
        <button onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>Federated Sign In</button>
      )}
    </div>
  );
}

export default App;
