import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

  const onLoginClick = (event: React.MouseEvent) => {
    if (!email && !password) {
      alert('Do something');
      return;
    }
    event.preventDefault();
    logInWithEmailAndPassword();
  }

  return (
    <Box>
      <Box textAlign="left" w="400px">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input id="login-email" type="email"  onChange={(event) => setEmail(event.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input id="login-password" type="password" onChange={(event) => setPassword(event.target.value)} />
        </FormControl>

        <Text fontSize='sm' color="blue.500" fontWeight="semibold" marginTop="1">Forget Password?</Text>

        <Button width="full" mt={4} type="submit" onClick={e => onLoginClick(e)}>
          Log In
        </Button>
      </Box>
    </Box>
  );
}