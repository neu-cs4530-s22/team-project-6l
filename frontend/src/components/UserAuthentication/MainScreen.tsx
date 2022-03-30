import { Box, Button, Flex} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from './LoginForm';
import SSOForm from './SSOForm';

export default function MainScreen():JSX.Element {
  const history = useHistory();
  
  const onRegisterClick = (event:React.MouseEvent) => {
    event.preventDefault();
    history.push("/register");
  };

  // TODO: replace those alert and console.log error modal.
  return (
    <div>
      <LoginForm />
      <Flex width="full" align="center" justifyContent="center">
        <Box textAlign="center">
          <div>{'Don \'t have an account'}</div>
          <div>
            <Button variantColor="teal" variant="link" onClick={onRegisterClick}>
              Register
            </Button>
          </div>
        </Box>
      </Flex>
      <SSOForm />
    </div>
      
  )
}