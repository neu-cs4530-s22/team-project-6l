import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Flex, Text } from '@chakra-ui/react';
import FacebookIcon from '@material-ui/icons/Facebook';
import { FcGoogle } from 'react-icons/fc';
import { AuthProvider, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../firebase/firebase-config';

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
      history.push("/pre-join-screen");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode)
      console.log(errorMessage)
    })
  }

  return (
      <Flex width="full" align="center" justifyContent="center" flexDirection="column" marginTop="2">
        <Button variantColor="teal" type="submit" backgroundColor="white" borderColor="lightgray" borderWidth="1px" onClick={() => provdierSignIn('Google')} w="400px">
          <FcGoogle fontSize="23"/>
          <Text marginLeft="2">Sign in with Google</Text>
        </Button>
        <Button variantColor="teal" type="submit" backgroundColor="white" borderColor="lightgray" borderWidth="1px" onClick={() => provdierSignIn('Facebook')} w="400px" marginTop="3">
          <FacebookIcon fontSize='medium' color='primary'/>
          <Text marginLeft="2">Sign in with Facebook</Text>
        </Button>
      </Flex>
  )
}