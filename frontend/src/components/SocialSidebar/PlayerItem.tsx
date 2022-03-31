import { Center, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import FriendRequest from '../FriendRequest/FreindRequest';

type PlayerItemProps = {
  player: Player;
};
export default function PlayerItem({ player }: PlayerItemProps): JSX.Element {
  const { userName } = useCoveyAppState();
  return (
    <Flex p={2}>
      <Center>
        <Text>{player.userName}</Text>
      </Center>
      <Spacer />
      {userName !== player.userName ? <FriendRequest /> : ''}
    </Flex>
  );
}
