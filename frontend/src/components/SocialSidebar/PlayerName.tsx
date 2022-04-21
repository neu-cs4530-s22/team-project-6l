import { Text } from '@chakra-ui/react';
import React from 'react';

type PlayerNameProps = {
  userName: string;
};
export default function PlayerName({ userName }: PlayerNameProps): JSX.Element {
  return <Text>{userName}</Text>;
}
