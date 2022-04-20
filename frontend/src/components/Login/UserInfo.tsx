import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

interface IUserInfoProps {
  userName: string;
  email: string;
  avatar: string;
}

export default function UserInfo({ userName, email, avatar }: IUserInfoProps): JSX.Element {
  return (
    <Box p='4' borderWidth='1px' borderRadius='lg'>
      <Heading as='h2' size='lg'>
        Profile
      </Heading>
      <Box flexDirection='column'>
        <Box>1</Box>
        <Box>2</Box>
      </Box>
      {/* <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input name="name"
               value={userName}
               isReadOnly />
        <FormLabel marginTop="10px" htmlFor="avatar">Avatar</FormLabel>
        <Avatar borderRadius='none' marginTop="5px" size='2xl' src={`/avatars/${avatar}.jpg`} />
     </FormControl> */}
    </Box>
  );
}
