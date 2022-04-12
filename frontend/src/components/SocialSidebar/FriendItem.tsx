import { Avatar, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';

type FriendItemProps = {
  player: Player;
};
export default function FriendItem({ player }: FriendItemProps): JSX.Element {
  return (
    <Flex my={2}>
      <Center>
        <Avatar
          borderRadius='none'
          marginTop='5px'
          size='md'
          src={`/avatars/${player.avatar}.jpg`}
        />
        <Text ms={2}>{player.userName}</Text>
      </Center>
    </Flex>
  );
}
