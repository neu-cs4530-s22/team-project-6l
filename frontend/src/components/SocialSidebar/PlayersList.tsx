import { Box, Heading, List, Text } from '@chakra-ui/react';
import useCurrentPlayer from 'hooks/useCurrentPlayer';
import React from 'react';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import FriendItem from './FriendItem';
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
  const currentPlayer = useCurrentPlayer();
  const friendList = players.filter(p => currentPlayer.friends.find(f => f.email === p.email));
  const friendUsernames = friendList.map(f => f.userName);
  // const friendUsernames = players.filter(p => currentPlayer.friends.find(f => f.email === p.email));
  const otherPlayers = players.filter(
    p => p.userName !== currentPlayer.userName && friendUsernames.indexOf(p.userName) === -1,
  );
  otherPlayers.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );

  return (
    <Box>
      <Heading as='h2' fontSize='l'>
        Your profile:
      </Heading>
      <FriendItem player={currentPlayer} />

      <Heading as='h2' fontSize='l' mt={4}>
        Friends in this town:
      </Heading>
      {friendUsernames.length === 0 ? (
        <Text my={1}>No friends in town</Text>
      ) : (
        <List>
          {currentPlayer.friends.map(friend => (
            <FriendItem key={friend.id} player={friend} />
          ))}
        </List>
      )}

      <Heading as='h2' fontSize='l' mt={4}>
        Other players in this town:
      </Heading>
      {otherPlayers.length === 0 ? (
        <Text my={1}>No other players in town</Text>
      ) : (
        <List>
          {otherPlayers.map(player => (
            <PlayerItem key={player.id} player={player} />
          ))}
        </List>
      )}
    </Box>
  );
}
