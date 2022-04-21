import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { nanoid } from 'nanoid';
import React from 'react';
import Player from '../../classes/Player';
import * as FriendRequest from './FriendRequest';
import PlayerItem from './PlayerItem';
import * as TestUtils from './TestUtils';

describe('PlayerItem', () => {
  const wrappedPlayerItemComponent = (player: Player) => (
    <ChakraProvider>
      <React.StrictMode>
        <PlayerItem player={player} />
      </React.StrictMode>
    </ChakraProvider>
  );
  const renderPlayerItem = (player: Player) => render(wrappedPlayerItemComponent(player));
  const player = new Player(
    `testingPlayerID0-${nanoid()}`,
    `testingPlayerUser0-${nanoid()}}`,
    TestUtils.randomLocation(),
    TestUtils.randomAvatar(),
    [],
    [],
    `testingPlayerEmail0-${nanoid()}`,
  );
  it('Renders a player item with with avatar, user name, and friend request button', async () => {
    const renderData = renderPlayerItem(player);
    const playerItem = renderData.queryByTestId('player-item');
    const avatar = renderData.queryByTestId('avatar');
    expect(playerItem).toContainElement(avatar);
    expect(playerItem).toHaveTextContent(`${player.userName}Add Friend`);
  });
  it('Renders a player with FriendRequest component', async () => {
    const mockFriendRequest = jest.spyOn(FriendRequest, 'default');
    try {
      renderPlayerItem(player);
      await waitFor(() => {
        expect(mockFriendRequest).toHaveBeenCalled();
      });
    } finally {
      mockFriendRequest.mockRestore();
    }
  });
});
