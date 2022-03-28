
import { Box, Flex} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

export default function MainScreen():JSX.Element {

  return (
    <div>
      <LoginForm />
      <Flex width="full" align="center" justifyContent="center">
        <Box textAlign="center">
          <div>{'Don \'t have an account'}</div>

        </Box>
      </Flex>
    </div>
      
  )
}