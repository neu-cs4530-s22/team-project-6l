import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { FacebookAuthProvider, GoogleAuthProvider , signInWithPopup} from "firebase/auth";
import auth from '../../firebase/firebase-config';

export default function SSOForm() {
  const history = useHistory();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // TODO: ugly codes combine them into reduced function.
  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider).then((userCredential) => {
      const user1 = userCredential.user;
      console.log(user1.toJSON());
      history.push("/prejoinscreen");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
		
      console.log(errorCode)
      console.log(errorMessage)
   });
  };

  const facebookSignIn = () => {
    signInWithPopup(auth, facebookProvider).then((userCredential) => {
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
        <Button variantColor="teal" variant="link" onClick={googleSignIn}>
          Sign in with Google
        </Button>
      </Flex>
      <Flex width="full" align="center" justifyContent="center">
        <Button variantColor="teal" variant="link" onClick={facebookSignIn}>
          Sign in with Facebook
        </Button>
      </Flex>
    </div>
  )
}