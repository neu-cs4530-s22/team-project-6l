import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import authCheck from './authCheck';
import auth from '../../firebaseAuth/firebase-config';

export default function LoginForm() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const logInWithEmailAndPassword = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => history.push("/pre-join-screen"))
      .catch((error) => {
        const { code } = error;
          setAlert(true);
          setAlertMess(authCheck(code));
      })
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
  }

  const onForgotPassClick = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push("/forgot-password");
  }

  return (
    <Box textAlign="left" w="400px" marginBottom="2">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input data-testid="login-email" type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input data-testid='login-password' type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
      </FormControl>
      <Button data-testid='forgot-password-btn' fontSize='sm' color="blue.500" fontWeight="semibold" variant="link" onClick={e => onForgotPassClick(e)}>Forgot Password?</Button>
      {isAlert ?
        <Box marginTop="2">
          <Alert data-testid="alert-error" status='error'>
            <AlertIcon />
            <AlertTitle data-testid='alert-message' mr={2}>{alertMess}</AlertTitle>
            <CloseButton marginLeft="1" position='absolute' right='8px' top='8px' onClick={() => setAlert(false)} />
          </Alert>
        </Box> : <></>}
      <Button data-testid="sign-in-btn" width="full" mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onLoginClick(e)}>
        Sign In
      </Button>
    </Box>
  );
}