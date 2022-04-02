import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '../../firebase/firebase-config';


export default function ForgotPassword() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [isSent, setSent] = React.useState(false);

  const onSignInClick = ((event: React.MouseEvent) => {
    event.preventDefault();
    history.push("/");
  });

  const onSendingClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (email) {
      setSent(true);
      sendPasswordResetEmail(auth, email.trim());
    } else {
      alert("Please enter the valid email");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        textAlign="left"
        w="800px" maxW='lg'
        backgroundColor="white"
        borderRadius='lg'
        paddingTop="6"
        paddingBottom="6"
        paddingLeft="8"
        paddingRight="8"
        shadow="0 0 0 2px rgba(0, 0, 0, 0.2)"
      >
        {isSent ?
          <>
            <Text fontSize='sm' fontWeight="semibold">A reset link has been sent to your email.</Text>
            <Button mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onSignInClick(e)}> Sign in </Button>
          </> :
          <>
            <Text fontSize='2xl' fontWeight="semibold">Forgot Your Password?</Text>
            <Box textAlign="left" marginTop="2">
              <FormControl>
                <FormLabel>Enter your email</FormLabel>
                <Input id="for-email" type="email" placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
              </FormControl>
            </Box>
            <Box justifyContent="flex-end" display="flex">
              <Button mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onSendingClick(e)}> Reset </Button>
            </Box>
          </>
        }
      </Box>
    </div>
  );
}