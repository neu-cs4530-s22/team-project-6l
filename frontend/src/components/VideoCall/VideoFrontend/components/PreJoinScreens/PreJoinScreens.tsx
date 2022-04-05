import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import { useHistory } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import { Button, Center, Heading, Text } from '@chakra-ui/react';
import TownSelection from '../../../../Login/TownSelection';
import auth from '../../../../../firebaseAuth/firebase-config';
import RegisterUserScreen from './RegisterUserScreen/RegisterUserScreen';
import useUserAccount from 'hooks/useUserAccount';
import { signOut } from 'firebase/auth';
import { Avatar, useGetUserQuery, User } from 'generated/graphql';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens(props: { doLogin: (initData: TownJoinResponse) => Promise<boolean> }) {
  const history = useHistory();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();
  const { userState, userDispatch } = useUserAccount();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [result, reexecuteQuery] = useGetUserQuery({
    variables: {
      username: email!
    }
  });

  useEffect(() => {
    console.log(`Component mounted: ${email}`)
    setEmail(auth.currentUser?.email);
  }, []);

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  auth.onAuthStateChanged(user => {
    setEmail(user?.email);
  });

  const handleSignOut = () => {
    userDispatch({
      action: 'registerUser',
      data: {
        _id: '',
        email: '',
        avatar: Avatar.Dog,
        createdAt: '',
        lastOnline: '',
        displayName: '',
        username: '',
        friends: new Array<User>(),
      }
    });

    signOut(auth).then(() => {
      history.push("/");
    }).catch((error) => {
      alert(error.message);
    });
  }

  useEffect(() => {
    if (result.fetching || userState.displayName) return;

    const timerId = setTimeout(() => {
      reexecuteQuery({
        variables: {
          username: email
        },
        requestPolicy: 'network-only'
      });
    }, 1000);


    if (result.data?.user) {
      userDispatch({
        action: 'registerUser',
        data: {
          _id: result.data.user._id,
          email: result.data.user.email,
          avatar: result.data.user.avatar,
          createdAt: result.data.user.createdAt,
          lastOnline: result.data.user.lastOnline,
          displayName: result.data.user.displayName,
          username: result.data.user?.username,
          friends: new Array<User>(),
        }
      });
    }
    setDisplayName(userState.displayName);
    return () => clearTimeout(timerId);
  }, [email, result.fetching, reexecuteQuery]);


  return (
    <IntroContainer>
      <RegisterUserScreen />
      <MediaErrorSnackbar error={mediaError} />
      <Heading as="h2" size="xl">Welcome to Covey.Town, {userState.displayName.toUpperCase()}!</Heading>
      <Text p="4">
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat.
        To get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      <RegisterUserScreen />
      <DeviceSelectionScreen />
      <TownSelection doLogin={props.doLogin} />
      <div style={{ marginTop: 20 }}>
        <Center>
          <Button colorScheme='black' variant='outline' onClick={handleSignOut}>Sign out</Button>
        </Center>
      </div>
    </IntroContainer >
  );
}
