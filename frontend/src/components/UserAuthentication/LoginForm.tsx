import React from 'react';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import {signInWithEmailAndPassword} from 'firebase/auth';
import auth from '../../firebase/firebase-config';

export default function LoginForm() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const logInWithEmailAndPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push("/prejoinscreen");
    } catch (err) {
      alert(err.message);
    }
  };

  const onLoginClick = (event:React.MouseEvent) => {
    if (!email && !password) {
      alert('Do something');
      return;
    }
    event.preventDefault();
    logInWithEmailAndPassword();
  }

  return (
    <Flex width="full" align="center" justifyContent="center">
      <Box>
        <Box textAlign="center">
          <Heading>Convey Town</Heading>
        </Box>
        <Box textAlign="left">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input id="login-email" type="email" onChange={(event) => setEmail(event.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input id="login-password" type="password" onChange={(event) => setPassword(event.target.value)}/>
          </FormControl>

          <Button width="full" mt={4} type="submit" onClick={e => onLoginClick(e)}>
            Log In
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}