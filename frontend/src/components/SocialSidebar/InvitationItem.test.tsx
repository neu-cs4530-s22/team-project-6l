import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { nanoid } from 'nanoid';
import React from 'react';
import { Provider, Client } from 'urql';
import { never } from 'wonka';
import Player from '../../classes/Player';
import { InvitationMessage } from '../../generated/graphql';
import * as useCurrentPlayer from '../../hooks/useCurrentPlayer';
import InvitationItem from './InvitationItem';
import * as TestUtils from './TestUtils';

describe('InvitationItem', () => {
  const wrappedInvitationItemComponent = (invitation: InvitationMessage) => (
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
          <InvitationItem invitation={invitation} />
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
  const renderInvitationItem = (invitation: InvitationMessage) =>
    render(wrappedInvitationItemComponent(invitation));
  let useCurrentPlayerSpy: jest.SpyInstance<Player, []>;
  let currentPlayer: Player;
  let invitations: InvitationMessage[] = [];

  beforeAll(() => {
    useCurrentPlayerSpy = jest.spyOn(useCurrentPlayer, 'default');
  });
  beforeEach(() => {
    invitations = [TestUtils.createFriendInvitationMessage(0)];
    currentPlayer = new Player(
      `testingPlayerID-${nanoid()}`,
      `testingPlayerUser-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      invitations,
      `testingPlayerEmail-${nanoid()}`,
    );
    useCurrentPlayerSpy.mockReturnValue(currentPlayer);
  });
  afterAll(() => {
    useCurrentPlayerSpy.mockRestore();
  });
  it('Renders an invitation item with with user name of who the invitation is from and delete button', async () => {
    const renderData = renderInvitationItem(invitations[0]);
    const invitationItem = renderData.queryByTestId('invitation-item');
    const deleteButton = renderData.queryByTestId('delete-invitation-button');
    expect(invitationItem).toHaveTextContent(invitations[0].from);
    expect(invitationItem).toContainElement(deleteButton);
  });
  it('Opens a modal with right header when invitation is clicked on', async () => {
    const renderData = renderInvitationItem(invitations[0]);
    const invitationItem = await renderData.findByTestId('invitation-item');
    expect(renderData.queryByTestId('invitation-modal-header')).toBe(null);
    userEvent.click(invitationItem);
    await waitFor(async () => {
      expect(renderData.queryByTestId('invitation-modal-header')).toHaveTextContent(
        'Friend Request',
      );
    });
  });
  it('Deletes invitation when delete button is clicked on', async () => {
    const renderData = renderInvitationItem(invitations[0]);
    const deleteButton = await renderData.findByTestId('delete-invitation-button');
    expect(currentPlayer.invitations).toEqual(invitations);
    userEvent.click(deleteButton);
    await waitFor(() => {
      expect(currentPlayer.invitations).toEqual([]);
    });
  });
});
