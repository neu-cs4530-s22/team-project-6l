import { Text } from '@chakra-ui/react';
import React from 'react';
import Player from '../../classes/Player';

type PlayerNameProps = {
  player: Player;
};
export default function PlayerItem({ player }: PlayerNameProps): JSX.Element {
  return <Text>{player.userName}</Text>;
}
