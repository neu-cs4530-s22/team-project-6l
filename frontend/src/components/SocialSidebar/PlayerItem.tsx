import { Center, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';
import FriendRequest from '../FriendRequest/FreindRequest';

type PlayerItemProps = {
  player: Player;
};
export default function PlayerItem({ player }: PlayerItemProps): JSX.Element {
  return (
    <Flex p={2}>
      <Center>
        <Text>{player.userName}</Text>
      </Center>
      <Spacer />
      <FriendRequest />
    </Flex>
  );
}
