import { Avatar, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';
import FriendRequest from './FreindRequest';

type PlayerItemProps = {
  player: Player;
};
export default function PlayerItem({ player }: PlayerItemProps): JSX.Element {
  return (
    <Flex data-testid='player-item' m={2}>
      <Center>
        <Avatar
          data-testid='avatar'
          borderRadius='none'
          marginTop='5px'
          size='md'
          src={`/avatars/${player.avatar}.jpg`}
        />
        <Text ms={2}>{player.userName}</Text>
      </Center>
      <Spacer />
      <Center>
        <FriendRequest username={player.userName} />
      </Center>
    </Flex>
  );
}
