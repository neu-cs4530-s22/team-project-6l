import { Box, Center, Flex, Heading, ListItem, OrderedList, Text } from '@chakra-ui/react';
import React from 'react';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerItem from './PlayerItem';
import PlayerName from './PlayerName';

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
  const currentPlayer = useCurrentPlayer();
  const sorted = players.filter(p => p.id !== currentPlayer.id);
  sorted.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );

  return (
    <Box>
      <Flex mt={1} mb={2} me={2}>
        <Center>
          {/* TODO: Display User Profile */}
          <Text me={2}>You:</Text>
        </Center>
        {currentPlayer ? <PlayerName player={currentPlayer} /> : ''}
      </Flex>

      <Heading as='h2' fontSize='l'>
        Other players in this town:
      </Heading>
      {sorted.length === 0 ? (
        <Text my={1}>No other players in town</Text>
      ) : (
        <OrderedList>
          {sorted.map(player => (
            <ListItem key={player.id}>
              <PlayerItem player={player} />
            </ListItem>
          ))}
        </OrderedList>
      )}
    </Box>
  );
}
