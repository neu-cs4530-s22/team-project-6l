import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { nanoid } from 'nanoid';
import React from 'react';
import Player from '../../classes/Player';
import FriendItem from './FriendItem';
import * as TestUtils from './TestUtils';

describe('FriendItem', () => {
  const wrappedFriendItemComponent = (friend: Player) => (
    <ChakraProvider>
      <React.StrictMode>
        <FriendItem player={friend} />
      </React.StrictMode>
    </ChakraProvider>
  );
  const renderFriendItem = (friend: Player) => render(wrappedFriendItemComponent(friend));

  it('Renders a friend item with with avatar and user name', async () => {
    const player = new Player(
      `testingPlayerID0-${nanoid()}`,
      `testingPlayerUser0-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      [],
      `testingPlayerEmail0-${nanoid()}`,
    );
    const renderData = renderFriendItem(player);
    const friendItem = renderData.queryByTestId('friend-item');
    const avatar = renderData.queryByTestId('avatar');
    expect(friendItem).toContainElement(avatar);
    expect(friendItem).toHaveTextContent(`${player.userName}`);
  });
});
