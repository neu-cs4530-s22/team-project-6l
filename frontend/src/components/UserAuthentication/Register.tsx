import React from 'react';
import {
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import authCheck from './authCheck';
import auth from '../../firebaseAuth/firebase-config';

export default function Register() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const onSignInClick = ((event: React.MouseEvent) => {
    event.preventDefault();
    history.push("/");
  });

  const onRegisterClick = (event: React.MouseEvent) => {
    if (!email || !password || !confirmPassword || password !== confirmPassword) {
      setAlert(true);
      if (!email) setAlertMess('Please enter your email');
      else if (!password) setAlertMess('Please enter your password');
      else if (!confirmPassword) setAlertMess('Please confirm your password');
      else setAlertMess('Passwords do not match');
    } else {
      event.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // call signOut here so user wont be automatically redirected to PreJoinScreen 
          // instead the user will be directed back to SignIn Screen
          // may be removed if we allow guests join with signing in.
          auth.signOut();
          history.push("/")
        })
        .catch(error => {
          const { code } = error;
          setAlertMess(authCheck(code));
          setAlert(true)
        });
    }
  }

  return (
    <Flex height="100vh" width="full" justifyContent="center" align="center" flexDirection="column">
      <Box
        textAlign="left"
        w="400px" maxW='lg'
        backgroundColor="white"
        borderRadius='lg'
        paddingTop="6"
        paddingBottom="6"
        paddingLeft="8"
        paddingRight="8"
        shadow="0 0 0 2px rgba(0, 0, 0, 0.2)"
      >
        <Text fontSize='2xl' fontWeight="semibold">Sign up</Text>
        <Box textAlign="left" marginTop="2">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input id="reg-email" type="email" placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input id="reg-password" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input id="reg-confirmpassword" type="password" placeholder="Confirm Password" onChange={(event) => setConfirmPassword(event.target.value)} />
          </FormControl>

          {isAlert ?
            <Box marginTop="2">
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle mr={2}>{alertMess}</AlertTitle>
                <CloseButton marginLeft="1" position='absolute' right='8px' top='8px' onClick={() => setAlert(false)} />
              </Alert>
            </Box> : <></>}

          <Button width="full" mt={4} type="submit" backgroundColor="blue.500" color="white" onClick={e => onRegisterClick(e)}>
            Sign up
          </Button>
        </Box>
      </Box>
      <Flex width="full" justifyContent="center" align="center" paddingTop="6">
        <Text fontSize='sm' fontWeight="semibold">Already have an account?</Text>
        <Button fontSize='sm' marginLeft='1' color="blue.500" fontWeight="semibold" variant="link" onClick={e => onSignInClick(e)}>Sign in</Button>
      </Flex>
    </Flex>
  );
}