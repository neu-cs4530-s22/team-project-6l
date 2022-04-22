import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import FacebookIcon from '@material-ui/icons/Facebook';
import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import authCheck from './authCheck';
import auth from '../../firebaseAuth/firebase-config';

export default function SSOForm() {
  const history = useHistory();
  const [errorMess, setErrorMess] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const provdierSignIn = async (providerName: string) => {
    let provider: AuthProvider;
    if (providerName === 'Google') {
      provider = googleProvider;
    } else {
      provider = facebookProvider;
    };
    
    await signInWithPopup(auth, provider)
      .then(() => {
        history.push('/pre-join-screen');
      })
      .catch((error) => {
        const { code } = error;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          onClose();
        } else {
          setErrorMess(authCheck(code));
          onOpen();
        }
      });
  };

  return (
    <Flex width='full' flexDirection='column' marginTop='2'>
      <Button
        data-testid='google-btn'
        variantcolor='teal'
        type='submit'
        backgroundColor='white'
        borderColor='lightgray'
        borderWidth='1px'
        onClick={() => provdierSignIn('Google')}
        w='400px'>
        <FcGoogle fontSize='23' />
        <Text marginLeft='2'>Sign in with Google</Text>
      </Button>
      <Button
        data-testid='facebook-btn'
        variantcolor='teal'
        type='submit'
        backgroundColor='white'
        borderColor='lightgray'
        borderWidth='1px'
        onClick={() => provdierSignIn('Facebook')}
        w='400px'
        marginTop='3'>
        <FacebookIcon fontSize='medium' color='primary' />
        <Text marginLeft='2'>Sign in with Facebook</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader data-testid='error'>{errorMess}</ModalHeader>
        </ModalContent>
      </Modal>
    </Flex>
  );
}