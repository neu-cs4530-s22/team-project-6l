import { Avatar, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { FriendProfile } from '../../classes/Player';

type FriendItemProps = {
  friend: FriendProfile;
};
/**
 * Displays a user's friend with their display name and avatar.
 */
export default function FriendItem({ friend }: FriendItemProps): JSX.Element {
  return (
    <Flex data-testid='friend-item' my={2}>
      <Center>
        <Avatar
          data-testid='avatar'
          borderRadius='none'
          marginTop='5px'
          size='md'
          src={`/avatars/${friend._avatar}.jpg`}
        />
        <Text ms={2}>{friend._userName}</Text>
      </Center>
    </Flex>
  );
}
