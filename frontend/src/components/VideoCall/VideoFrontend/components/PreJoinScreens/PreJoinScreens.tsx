import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import { useHistory } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import { Button, Center, Heading, Text } from '@chakra-ui/react';
import TownSelection from '../../../../Login/TownSelection';
import { signOut } from 'firebase/auth';
import auth from '../../../../../firebaseAuth/firebase-config';
import RegisterUserScreen from './RegisterUserScreen/RegisterUserScreen';
import useUserAccount from 'hooks/useUserAccount';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens(props: { doLogin: (initData: TownJoinResponse) => Promise<boolean> }) {
  const history = useHistory();
  const { getAudioAndVideoTracks } = useVideoContext();

  const [mediaError, setMediaError] = useState<Error>();
  const { userState } = useUserAccount();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        history.push("/");
      }
    })
  })

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      history.push("/");
    }).catch((error) => {
      alert(error.message);
    });
  }

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
      <DeviceSelectionScreen />
      <TownSelection doLogin={props.doLogin} />
      <div style={{ marginTop: 20 }}>
        <Center>
          <Button colorScheme='black' variant='outline' onClick={handleSignOut}>Sign out</Button>
        </Center>
      </div>
    </IntroContainer>
  );
}
