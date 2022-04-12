import { Avatar, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';
import FriendRequest from '../FriendRequest/FreindRequest';

type PlayerItemProps = {
  player: Player;
};
export default function PlayerItem({ player }: PlayerItemProps): JSX.Element {
  console.log(player.avatar);
  return (
    <Flex p={2}>
      <Center>
        <Avatar borderRadius='none' marginTop="5px" size='md' src={`/avatars/${player.avatar}.jpg`} />
        <Text>{player.userName}</Text>
      </Center>
      <Spacer />
      <FriendRequest username={player.userName} />
    </Flex>
  );
}
