import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useHistory } from 'react-router-dom';
import auth from '../../firebaseAuth/firebase-config';
import authCheck from './authCheck';

/**
 * Displays a form which handles user's sign in
 * navigate to prejoinscreen if user succesfully sign up
 * otherwise it will appear alert error which indicates what user can't log in
 */
export default function LoginForm(): JSX.Element {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const logInWithEmailAndPassword = async () => {
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      if (credentials.user) {
        history.push('/pre-join-screen');
      }
    } catch (err) {
      const error = err as FirebaseError;
      const { code } = error;
      setAlert(true);
      setAlertMess(authCheck(code));
    }
  };

  const onLoginClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setAlert(true);
      if (!email) setAlertMess('Enter your email');
      else if (!password) setAlertMess('Enter your password');
      return;
    }
    logInWithEmailAndPassword();
  };

  const onForgotPassClick = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push('/forgot-password');
  };

  return (
    <Box textAlign='left' w='400px' marginBottom='2'>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          data-testid='login-email'
          type='email'
          placeholder='Email'
          onChange={event => setEmail(event.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          data-testid='login-password'
          type='password'
          placeholder='Password'
          onChange={event => setPassword(event.target.value)}
        />
      </FormControl>
      <Button
        data-testid='forgot-password-btn'
        fontSize='sm'
        color='blue.500'
        fontWeight='semibold'
        variant='link'
        onClick={e => onForgotPassClick(e)}>
        Forgot Password?
      </Button>
      {isAlert ? (
        <Box marginTop='2'>
          <Alert data-testid='alert-error' status='error'>
            <AlertIcon />
            <AlertTitle data-testid='alert-message' mr={2}>
              {alertMess}
            </AlertTitle>
            <CloseButton
              marginLeft='1'
              position='absolute'
              right='8px'
              top='8px'
              onClick={() => setAlert(false)}
            />
          </Alert>
        </Box>
      ) : (
        <></>
      )}
      <Button
        data-testid='sign-in-btn'
        width='full'
        mt={4}
        type='submit'
        backgroundColor='blue.500'
        color='white'
        onClick={e => onLoginClick(e)}>
        Sign In
      </Button>
    </Box>
  );
}
