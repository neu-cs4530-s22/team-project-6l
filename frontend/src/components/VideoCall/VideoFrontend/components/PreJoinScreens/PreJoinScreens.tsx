import { Button, Center, Heading, Text } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import auth from '../../../../../firebase/firebase-config';
import TownSelection from '../../../../Login/TownSelection';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import IntroContainer from '../IntroContainer/IntroContainer';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import { RegisterUserScreen } from './RegisterUserScreen/RegisterUserScreen';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

type PreJoinScreenProps = {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>;
};
export default function PreJoinScreens(props: PreJoinScreenProps) {
  const { doLogin } = props;
  const history = useHistory();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();
  const [currentUserEmail, setcurrentUserEmail] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user || !user.email) {
        history.push('/');
      } else {
        setcurrentUserEmail(user.email);
      }
    });
  });

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
    signOut(auth)
      .then(() => {
        history.push('/');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      <Heading as='h2' size='xl'>
        Welcome to Covey.Town!
      </Heading>
      <Text p='4'>
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat. To
        get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      <RegisterUserScreen email={currentUserEmail} />
      <DeviceSelectionScreen />
      <TownSelection doLogin={doLogin} />
      <Center mt={5}>
        <Button colorScheme='black' variant='outline' onClick={handleSignOut}>
          Sign out
        </Button>
      </Center>
    </IntroContainer>
  );
}
