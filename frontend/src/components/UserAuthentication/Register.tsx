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

export default function Register() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onRegisterClick = (event:React.MouseEvent) => {
    if (!email && !password) {
      alert('Do something');
      return;
    }
    event.preventDefault();
    history.push("/");
  }

  return (
    <Flex width="full" align="center" justifyContent="center">
      <Box>
        <Box textAlign="center">
          <Heading>Register</Heading>
        </Box>
        <Box textAlign="left">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" onChange={(event) => setEmail(event.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(event) => setPassword(event.target.value)}/>
          </FormControl>

          <Button width="full" mt={4} type="submit" onClick={e => onRegisterClick(e)}>
            Register
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}