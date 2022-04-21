import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Player, { PlayerListener } from '../../classes/Player';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
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
  const [friends, setFriends] = useState(currentPlayer.friends);
  const friendUsernames = friends.map(f => f.userName);
  const otherPlayers = players.filter(
    p => p.userName !== currentPlayer.userName && friendUsernames.indexOf(p.userName) === -1,
  );
  friendList.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );
  otherPlayers.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );

  useEffect(() => {
    const updateListener: PlayerListener = {
      onFriendsChange: (newFriends: Player[]) => {
        const newFriendList = players.filter(p => newFriends.find(f => f.email === p.email));
        setFriends(newFriendList);
      },
    };
    currentPlayer.addListener(updateListener);
    return () => {
      currentPlayer.removeListener(updateListener);
    };
  }, [setFriends, currentPlayer, players]);

  return (
    <Box>
      <Heading as='h2' fontSize='l'>
        Your profile:
      </Heading>
      <FriendItem player={currentPlayer} />

      <Heading as='h2' fontSize='l' mt={4}>
        Friends in this town:
      </Heading>
      {friendList.length === 0 ? (
        <Text my={1}>No friends in town</Text>
      ) : (
        <List data-testid='friend-list'>
          {friendList.map(friend => (
            <ListItem data-testid='friend-list-item' key={friend.id}>
              <FriendItem player={friend} />
            </ListItem>
          ))}
        </List>
      )}

      <Heading as='h2' fontSize='l' mt={4}>
        Other players in this town:
      </Heading>
      {otherPlayers.length === 0 ? (
        <Text my={1}>No other players in town</Text>
      ) : (
        <List data-testid='player-list'>
          {otherPlayers.map(player => (
            <ListItem data-testid='player-list-item' key={player.id}>
              <PlayerItem player={player} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
