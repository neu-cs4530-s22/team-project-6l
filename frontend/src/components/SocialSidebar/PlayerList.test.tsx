import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { Provider, Client } from 'urql';
import { never } from 'wonka';
import Player from '../../classes/Player';
import * as useCurrentPlayer from '../../hooks/useCurrentPlayer';
import * as usePlayersInTown from '../../hooks/usePlayersInTown';
import * as FriendItem from './FriendItem';
import * as PlayerItem from './PlayerItem';
import PlayersList from './PlayersList';
import * as TestUtils from './TestUtils';

describe('PlayersInTownList', () => {
  const wrappedPlayersListComponent = () => (
    <Provider
      value={
        {
          executeQuery: jest.fn(() => never),
          executeMutation: jest.fn(() => never),
          executeSubscription: jest.fn(() => never),
        } as unknown as Client
      }>
      <ChakraProvider>
        <React.StrictMode>
          <PlayersList />
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
  const renderPlayersList = () => render(wrappedPlayersListComponent());
  let useCurrentPlayerSpy: jest.SpyInstance<Player, []>;
  let usePlayersInTownSpy: jest.SpyInstance<Player[], []>;
  let currentPlayer: Player;
  let players: Player[] = [];
  let friends: Player[] = [];
  let otherPlayers: Player[] = [];
  const expectProperlyRenderedPlayersList = async (
    renderData: RenderResult,
    friendsToExpect: Player[],
    playersToExpect: Player[],
  ) => {
    const friendEntries = await renderData.findAllByTestId('friend-list-item');
    const otherPlayerEntries = await renderData.findAllByTestId('player-list-item');
    expect(friendEntries.length).toBe(friendsToExpect.length); // expect same number of friends
    expect(otherPlayerEntries.length).toBe(playersToExpect.length);

    const friendsSortedCorrectly = friendsToExpect
      .map(p => p.userName)
      .sort((p1, p2) => p1.localeCompare(p2, undefined, { numeric: true, sensitivity: 'base' }));
    for (let i = 0; i < friendsSortedCorrectly.length; i += 1) {
      expect(friendEntries[i]).toHaveTextContent(friendsSortedCorrectly[i]);
      const parentComponent = friendEntries[i].parentNode;
      if (parentComponent) {
        expect(parentComponent.nodeName).toBe('UL'); // list items expected to be directly nested in a list
      }
    }

    const playersSortedCorrectly = playersToExpect
      .map(p => `${p.userName}Add Friend`)
      .sort((p1, p2) => p1.localeCompare(p2, undefined, { numeric: true, sensitivity: 'base' }));
    for (let i = 0; i < playersSortedCorrectly.length; i += 1) {
      expect(otherPlayerEntries[i]).toHaveTextContent(playersSortedCorrectly[i]);
      const parentComponent = otherPlayerEntries[i].parentNode;
      if (parentComponent) {
        expect(parentComponent.nodeName).toBe('UL'); // list items expected to be directly nested in a list
      }
    }
  };
  beforeAll(() => {
    useCurrentPlayerSpy = jest.spyOn(useCurrentPlayer, 'default');
    usePlayersInTownSpy = jest.spyOn(usePlayersInTown, 'default');
  });

  beforeEach(() => {
    players = [];
    for (let i = 1; i < 10; i += 1) {
      players.push(
        new Player(
          `testingPlayerID${i}-${nanoid()}`,
          `testingPlayerUser${i}-${nanoid()}}`,
          TestUtils.randomLocation(),
          TestUtils.randomAvatar(),
          [],
          [],
          `testingPlayerEmail${i}-${nanoid()}`,
        ),
      );
    }
    friends = [players[0], players[1]];
    const friendUsernames = friends.map(f => f.userName);
    currentPlayer = new Player(
      `testingPlayerID0-${nanoid()}`,
      `testingPlayerUser0-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      friends.map(f => Player.toFriendProfile(f)),
      [],
      `testingPlayerEmail0-${nanoid()}`,
    );
    players.push(currentPlayer);
    otherPlayers = players.filter(
      p => p.userName !== currentPlayer.userName && friendUsernames.indexOf(p.userName) === -1,
    );
    usePlayersInTownSpy.mockReturnValue(players);
    useCurrentPlayerSpy.mockReturnValue(currentPlayer);
  });
  afterAll(() => {
    usePlayersInTownSpy.mockRestore();
    useCurrentPlayerSpy.mockRestore();
  });
  it("Renders a list of all players' user names, without checking sort", async () => {
    // players array is already sorted correctly
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);
  });
  it('Renders the current player and friends in a FriendItem component', async () => {
    const mockFriendItem = jest.spyOn(FriendItem, 'default');
    try {
      renderPlayersList();
      await waitFor(() => {
        expect(mockFriendItem).toBeCalledTimes(friends.length + 1);
      });
    } finally {
      mockFriendItem.mockRestore();
    }
  });
  it("Renders the other players' names in a PlayerItem component", async () => {
    const mockPlayerItem = jest.spyOn(PlayerItem, 'default');
    try {
      renderPlayersList();
      await waitFor(() => {
        expect(mockPlayerItem).toBeCalledTimes(players.length - friends.length - 1);
      });
    } finally {
      mockPlayerItem.mockRestore();
    }
  });
  it("Displays players' usernames in ascending alphabetical order", async () => {
    players.reverse();
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);
  });
  it('Does not mutate the array returned by usePlayersInTown', async () => {
    players.reverse();
    const copyOfArrayPassedToComponent = players.concat([]);
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);
    expect(players).toEqual(copyOfArrayPassedToComponent); // expect that the players array is unchanged by the compoennt
  });
  it('Adds players to the list when they are added to the town', async () => {
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);
    for (let i = 0; i < players.length; i += 1) {
      const newPlayer = new Player(
        `testingPlayerID-${i}.new`,
        `testingPlayerUser${i}.new`,
        TestUtils.randomLocation(),
        TestUtils.randomAvatar(),
        [],
        [],
        `testingPlayerEmail0-${nanoid()}`,
      );
      const newPlayers = players.concat([newPlayer]);
      usePlayersInTownSpy.mockReturnValue(newPlayers);
      renderData.rerender(wrappedPlayersListComponent());
      /* eslint-disable-next-line no-await-in-loop */
      await expectProperlyRenderedPlayersList(
        renderData,
        friends,
        otherPlayers.concat([newPlayer]),
      );
    }
  });
  it('Adds players to the list when they are added to the town', async () => {
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);

    const newPlayer = new Player(
      `testingPlayerID-0.new`,
      `testingPlayerUser0.new`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      [],
      `testingPlayerEmail0.new`,
    );
    const newPlayers = players.concat([newPlayer]);
    usePlayersInTownSpy.mockReturnValue(newPlayers);
    renderData.rerender(wrappedPlayersListComponent());
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers.concat([newPlayer]));
  });
  it('Removes other player from the list when they are removed from the town', async () => {
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);

    // remove first other player
    const newPlayers = players.concat([]);
    const newOtherPlayers = otherPlayers.concat([]);
    newPlayers.splice(2, 1);
    newOtherPlayers.splice(0, 1);
    usePlayersInTownSpy.mockReturnValue(newPlayers);
    renderData.rerender(wrappedPlayersListComponent());
    await expectProperlyRenderedPlayersList(renderData, friends, newOtherPlayers);
  });
  it('Removes friend from the list when they are removed from the town', async () => {
    const renderData = renderPlayersList();
    await expectProperlyRenderedPlayersList(renderData, friends, otherPlayers);

    // remove first other player
    const newPlayers = players.concat([]);
    const newFriends = friends.concat([]);
    newPlayers.splice(0, 1);
    newFriends.splice(0, 1);
    usePlayersInTownSpy.mockReturnValue(newPlayers);
    renderData.rerender(wrappedPlayersListComponent());
    await expectProperlyRenderedPlayersList(renderData, newFriends, otherPlayers);
  });
});
