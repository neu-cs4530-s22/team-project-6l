import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useHistory } from 'react-router-dom';
import auth from '../../firebaseAuth/firebase-config';
import authCheck from './authCheck';

/**
 * Displays register form where user can sign up using their email and password.
 * The users will be directed to prejoinscreen if they successfully register
 * otherwise it will show error message indicating the error
 */
export default function Register(): JSX.Element {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isAlert, setAlert] = React.useState(false);
  const [alertMess, setAlertMess] = React.useState('');

  const onSignInClick = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push('/');
  };

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
          history.push('/pre-join-screen');
        })
        .catch(error => {
          const { code } = error;
          setAlertMess(authCheck(code));
          setAlert(true);
        });
    }
  };

  return (
    <Flex height='100vh' width='full' justifyContent='center' align='center' flexDirection='column'>
      <Box
        textAlign='left'
        w='400px'
        maxW='lg'
        backgroundColor='white'
        borderRadius='lg'
        paddingTop='6'
        paddingBottom='6'
        paddingLeft='8'
        paddingRight='8'
        shadow='0 0 0 2px rgba(0, 0, 0, 0.2)'>
        <Text fontSize='2xl' fontWeight='semibold'>
          Sign up
        </Text>
        <Box textAlign='left' marginTop='2'>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              data-testid='reg-email'
              type='email'
              placeholder='Email'
              onChange={event => setEmail(event.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              data-testid='reg-password'
              type='password'
              placeholder='Password'
              onChange={event => setPassword(event.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              data-testid='reg-confirmpassword'
              type='password'
              placeholder='Confirm Password'
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </FormControl>

          {isAlert ? (
            <Box marginTop='2'>
              <Alert data-testid='error' status='error'>
                <AlertIcon />
                <AlertTitle data-testid='alert-mess' mr={2}>
                  {alertMess}
                </AlertTitle>
                <CloseButton
                  data-testid='alert-close'
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
            data-testid='sign-up'
            width='full'
            mt={4}
            type='submit'
            backgroundColor='blue.500'
            color='white'
            onClick={e => onRegisterClick(e)}>
            Sign up
          </Button>
        </Box>
      </Box>
      <Flex width='full' justifyContent='center' align='center' paddingTop='6'>
        <Text fontSize='sm' fontWeight='semibold'>
          Already have an account?
        </Text>
        <Button
          data-testid='sign-in'
          fontSize='sm'
          marginLeft='1'
          color='blue.500'
          fontWeight='semibold'
          variant='link'
          onClick={e => onSignInClick(e)}>
          Sign in
        </Button>
      </Flex>
    </Flex>
  );
}
