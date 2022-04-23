import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '../../firebaseAuth/firebase-config';
import authCheck from './authCheck';

/**
 * Display forgot password form, 
 * which will send a reset link to email if the users forget their password
 * and return error message if email is yet registered or invalid.
 */
export default function ForgotPassword():JSX.Element {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [isSent, setSent] = React.useState(false);
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const onSignInClick = ((event: React.MouseEvent) => {
    event.preventDefault();
    history.push("/");
  });

  const onSendingClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    await sendPasswordResetEmail(auth, email.trim())
    .then(() => setSent(true))
    .catch(error => {
      const {code} = error;
      setAlert(true);
      setAlertMess(authCheck(code));
    })
  }

  return (
    <Flex height="100vh" width="full" justifyContent="center" align="center" flexDirection="column">
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
            <Text data-testid="sent-message" fontSize='sm' fontWeight="semibold">A reset link has been sent to your email.</Text>
            <Button data-testid="signin-btn" mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onSignInClick(e)}>Sign in</Button>
          </> :
          <>
            <Text fontSize='2xl' fontWeight="semibold" marginTop="2">Forgot Your Password?</Text>
            <Box textAlign="left" marginTop="2">
              <FormControl>
                <FormLabel>Enter your email</FormLabel>
                <Input data-testid="forgot-email" type="email" placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
              </FormControl>
            </Box>
            {isAlert ?
            <Box marginTop="2">
              <Alert data-testid="error" status='error'>
                <AlertIcon />
                <AlertTitle data-testid="error-message" mr={2}>{alertMess}</AlertTitle>
                <CloseButton marginLeft="1" position='absolute' right='8px' top='8px' onClick={() => setAlert(false)} />
              </Alert>
            </Box> : <></>}
            <Box justifyContent="flex-end" display="flex">
              <Button mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onSendingClick(e)}> Reset </Button>
            </Box>
          </>
        }
      </Box>
    </Flex>
  );
}