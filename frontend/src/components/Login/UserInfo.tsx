import { Avatar, Box, Grid, GridItem, Heading, Text, UnorderedList } from '@chakra-ui/react';
import PlayerName from 'components/SocialSidebar/PlayerName';
import { User } from 'generated/graphql';
import React from 'react';

interface IUserInfoProps {
  userName: string;
  email: string;
  avatar: string;
  friends: User[];
}

export default function UserInfo({ userName, email, avatar, friends }: IUserInfoProps): JSX.Element {
  return (
    <Box p='4' borderWidth='1px' borderRadius='lg'>
      <Heading as='h2' size='lg'>
        Profile
      </Heading>
      <Box marginTop={2} marginLeft={2}>
        <Grid templateRows='repeat(1, 0fr)' templateColumns='repeat(5, 1fr)'>
          <GridItem marginRight='10'>
            <Avatar borderRadius='20' marginTop="5px" size='2xl' src={`/avatars/${avatar}.jpg`} />
          </GridItem >
          <GridItem colSpan={4} marginTop={5}>
            <Text fontSize='xl'>
              <span className='font'>Username: </span> 
              <span>{userName}</span>
            </Text>
            <Text fontSize='xl'> 
              <span className='font'>Email: </span> 
              <span>{email}</span>
            </Text>
            <Text fontSize='xl' fontWeight='600'>Your Friends: </Text>
            {friends.length === 0 ? 
              <Text fontSize='sm' marginLeft='2' marginRight='2'>
                You dont have any friends. Join the town and make more friends
              </Text> : 
              <UnorderedList ms={0}>
              {friends.map(friend => (
                <Text key={friend._id}>{friend.username}</Text>
              ))}
            </UnorderedList>}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
