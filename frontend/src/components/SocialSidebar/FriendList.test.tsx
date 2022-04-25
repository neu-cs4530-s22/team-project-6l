import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { nanoid } from 'nanoid';
import React from 'react';
import { Client, Provider } from 'urql';
import { never } from 'wonka';
import Player from '../../classes/Player';
import * as useCurrentPlayer from '../../hooks/useCurrentPlayer';
import FriendList from './FriendList';
import * as PlayerName from './PlayerName';
import * as TestUtils from './TestUtils';

describe('FriendList', () => {
  const wrappedFriendListComponent = () => (
    <Provider
      value={
        ({
          executeQuery: jest.fn(() => never),
          executeMutation: jest.fn(() => never),
          executeSubscription: jest.fn(() => never),
        } as unknown) as Client
      }>
      <ChakraProvider>
        <React.StrictMode>
          <FriendList />
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
  const renderFriendList = () => render(wrappedFriendListComponent());
  let useCurrentPlayerSpy: jest.SpyInstance<Player, []>;
  let friends: Player[] = [];
  let currentPlayer: Player;

  const expectProperlyRenderedFriendList = async (
    renderData: RenderResult,
    friendsToExpect: Player[],
  ) => {
    const friendButton = await renderData.findByTestId('friend-button');
    userEvent.click(friendButton);

    const friendEntries = await renderData.findAllByRole('listitem');
    expect(friendEntries.length).toBe(friendsToExpect.length); // expect same number of friends

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
  };

  beforeAll(() => {
    useCurrentPlayerSpy = jest.spyOn(useCurrentPlayer, 'default');
  });
  beforeEach(() => {
    friends = [];
    for (let i = 1; i < 2; i += 1) {
      friends.push(
        new Player(
          `testingPlayerID${i}-${nanoid()}`,
          `testingPlayerUser${i}-${nanoid()}}`,
          TestUtils.randomLocation(),
          TestUtils.randomAvatar(),
          [],
          [],
          `testingPlayerEmail0-${nanoid()}`,
        ),
      );
    }
    currentPlayer = new Player(
      `testingPlayerID0-${nanoid()}`,
      `testingPlayerUser0-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      friends.map(f => Player.toFriendProfile(f)),
      [],
      `testingPlayerEmail0-${nanoid()}`,
    );
    useCurrentPlayerSpy.mockReturnValue(currentPlayer);
  });
  afterAll(() => {
    useCurrentPlayerSpy.mockRestore();
  });
  it("Renders a list of all freinds' user names", async () => {
    const renderData = renderFriendList();
    await expectProperlyRenderedFriendList(renderData, friends);
  });
  it('Renders the friends in a PlayerName component', async () => {
    const mockPlayerName = jest.spyOn(PlayerName, 'default');
    try {
      renderFriendList();
      await waitFor(() => {
        expect(mockPlayerName).toBeCalledTimes(friends.length + 1);
      });
    } finally {
      mockPlayerName.mockRestore();
    }
  });
  it('Does not mutate the friends of the player returned by useCurrentPlayer', async () => {
    friends.reverse();
    const copyOfArrayPassedToComponent = friends.concat([]);
    const renderData = renderFriendList();
    await expectProperlyRenderedFriendList(renderData, friends);
    expect(friends).toEqual(copyOfArrayPassedToComponent); // expect that the players array is unchanged by the compoennt
  });
});
