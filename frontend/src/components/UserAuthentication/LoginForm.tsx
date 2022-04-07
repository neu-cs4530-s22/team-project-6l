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
import auth from '../../firebase/firebase-config';
import authCheck from './authCheck';

export default function LoginForm() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const logInWithEmailAndPassword = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => history.push("/pre-join-screen"))
      .catch((error) => {
        const { code } = error;
          setAlert(true);
          setAlertMess(authCheck(code));
      })
  };

  const onLoginClick = (event: React.MouseEvent) => {
    if (!email || !password) {
      setAlert(true);
      if (!email) setAlertMess('Enter your email');
      else if (!password) setAlertMess('Enter your password');
    }
    event.preventDefault();
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
        <Input id="login-email" type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input id="login-password" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
      </FormControl>
      <Button fontSize='sm' color="blue.500" fontWeight="semibold" variant="link" onClick={e => onForgotPassClick(e)}>Forgot Password?</Button>
      {isAlert ?
        <Box marginTop="2">
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle mr={2}>{alertMess}</AlertTitle>
            <CloseButton marginLeft="1" position='absolute' right='8px' top='8px' onClick={() => setAlert(false)} />
          </Alert>
        </Box> : <></>}
      <Button width="full" mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onLoginClick(e)}>
        Sign In
      </Button>
    </Box>
  );
}