import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { Client, Provider } from 'urql';
import { never } from 'wonka';
import { FriendProfile } from '../../classes/Player';
import FriendItem from './FriendItem';
import * as TestUtils from './TestUtils';

describe('FriendItem', () => {
  const wrappedFriendItemComponent = (friend: FriendProfile) => (
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
          <FriendItem friend={friend} />
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
  const renderFriendItem = (friend: FriendProfile) => render(wrappedFriendItemComponent(friend));

  it('Renders a friend item with with avatar and user name', async () => {
    const friend: FriendProfile = {
      _userName: `testingPlayerID0-${nanoid()}`,
      _avatar: TestUtils.randomAvatar(),
      _email: `testingPlayerEmail0-${nanoid()}`,
    };

    const renderData = renderFriendItem(friend);
    const friendItem = renderData.queryByTestId('friend-item');
    const avatar = renderData.queryByTestId('avatar');
    expect(friendItem).toContainElement(avatar);
    expect(friendItem).toHaveTextContent(`${friend._userName}`);
  });
});
