import { Text } from '@chakra-ui/react';
import React from 'react';

type PlayerNameProps = {
  userName: string;
};
/**
 * Displays a player with their display name.
 */
export default function PlayerName({ userName }: PlayerNameProps): JSX.Element {
  return <Text>{userName}</Text>;
}
