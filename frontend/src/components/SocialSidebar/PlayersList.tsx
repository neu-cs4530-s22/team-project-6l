import { Box, Center, Flex, Heading, ListItem, OrderedList, Text } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerItem from './PlayerItem';

/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 *
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 *
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 *
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 *
 */
export default function PlayersInTownList(): JSX.Element {
  const players = usePlayersInTown();
  const { userName } = useCoveyAppState();
  const sorted = [...players].sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );
  const currentPlayer = players.find(p => p.userName === userName);

  return (
    <Box>
      <Flex>
        <Center>
          {/* TODO: Display User Profile */}
          <Text>You:</Text>
        </Center>
        {currentPlayer ? <PlayerItem player={currentPlayer} /> : ''}
      </Flex>

      <Heading as='h2' fontSize='l'>
        Other players in this town:
      </Heading>
      <OrderedList>
        {sorted
          .filter(p => p.userName !== userName)
          .map(player => (
            <ListItem key={player.id}>
              <PlayerItem player={player} />
            </ListItem>
          ))}
      </OrderedList>
    </Box>
  );
}
