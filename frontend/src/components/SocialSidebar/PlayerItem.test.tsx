import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { nanoid } from 'nanoid';
import React from 'react';
import Player from '../../classes/Player';
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

  it('Renders a player item with with avatar, user name, and friend request button', async () => {
    const player = new Player(
      `testingPlayerID0-${nanoid()}`,
      `testingPlayerUser0-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      [],
    );
    const renderData = renderPlayerItem(player);
    const playerItem = renderData.queryByTestId('player-item');
    const avatar = renderData.queryByTestId('avatar');
    expect(playerItem).toContainElement(avatar);
    expect(playerItem).toHaveTextContent(`${player.userName}Add Friend`);
  });
});
