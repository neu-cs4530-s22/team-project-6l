import React from 'react';
import { Box, Text, Flex, Button, } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import auth from '../../firebaseAuth/firebase-config';
import SSOForm from './SSOForm';
import DividerWithText from './DividerWithText';
import LoginForm from './LoginForm';

/**
 * Main Page which contains all the forms needed for user authentication
 * 
 * @returns JSX.Element
 */
export default function MainScreen(): JSX.Element {
  const history = useHistory();

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        history.push("/pre-join-screen");
      }
    })
  })

  const onRegisterClick = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push("/register");
  };

  return (
    <Flex height="100vh" width="full" justifyContent="center" align="center" flexDirection="column">
      <Box maxW='lg' backgroundColor="white" borderRadius='lg' paddingTop="6" paddingBottom="6" paddingLeft="8" paddingRight="8" shadow="0 0 0 2px rgba(0, 0, 0, 0.2)">
        <Text fontSize='2xl' fontWeight="semibold">Sign In</Text>
        <Text fontSize='sm' fontWeight="semibold" marginBottom="2">Join Covey Town and make friends</Text>
        <LoginForm />
        <DividerWithText>or</DividerWithText>
        <SSOForm />
      </Box>
      <Flex width="full" justifyContent="center" align="center" paddingTop="6">
        <Text fontSize='sm' fontWeight="semibold">{'Don\'t have an account? '}</Text>
        <Button fontSize='sm' marginLeft='1' color="blue.500" fontWeight="semibold" variant="link" onClick={e => onRegisterClick(e)}>Join now</Button>
      </Flex>
    </Flex>
  )
}