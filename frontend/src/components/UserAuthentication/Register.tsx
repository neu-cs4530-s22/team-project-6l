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
import {createUserWithEmailAndPassword} from 'firebase/auth';
import auth from '../../firebase/firebase-config';


export default function Register() {
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const onLogInClick = ((event:React.MouseEvent) => {
    event.preventDefault();
    history.push("/");
  });

  const onRegisterClick = (event:React.MouseEvent) => {
    if (email === '' || password === '' || confirmPassword ==='' || password !== confirmPassword) { 
      alert('invalid inputs');
    } else {
      event.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        history.push("/")
      })
      .catch(error => alert(error.message));

    }
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
            <Input id="reg-email" type="email" onChange={(event) => setEmail(event.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input id="reg-password" type="password" onChange={(event) => setPassword(event.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input id="reg-confirmpassword" type="password" onChange={(event) => setConfirmPassword(event.target.value)}/>
          </FormControl>

          <Button width="full" mt={4} type="submit" onClick={e => onRegisterClick(e)}>
            Register
          </Button>
        </Box>
        <Box textAlign="center">
          <div>{'Already have an account? '}</div>
          <div>
            <Button variantColor="teal" variant="link" onClick={onLogInClick}>
              Log in 
            </Button>
          </div>
        </Box>
      </Box>
    </Flex>
  );
}