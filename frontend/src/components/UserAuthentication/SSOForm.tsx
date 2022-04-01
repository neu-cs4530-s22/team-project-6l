import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../firebaseAuth/firebase-config';

export default function SSOForm() {
  const history = useHistory();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const provdierSignIn = (providerName: string): void => {
    let provider: AuthProvider;
    if (providerName === 'Google') {
      provider = googleProvider;
    } else {
      provider = facebookProvider;
    };

    signInWithPopup(auth, provider).then((userCredential) => {
      const user2 = userCredential.user;
      console.log(user2);
      history.push("/prejoinscreen");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode)
      console.log(errorMessage)
    })
  }

  return (
    <div>
      <Flex width="full" align="center" justifyContent="center">
        <Button variantColor="teal" variant="link" onClick={() => provdierSignIn('Google')}>
          Sign in with Google
        </Button>
      </Flex>
      <Flex width="full" align="center" justifyContent="center">
        <Button variantColor="teal" variant="link" onClick={() => provdierSignIn('Facebook')}>
          Sign in with Facebook
        </Button>
      </Flex>
    </div>
  )
}