import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { nanoid } from 'nanoid';
import React from 'react';
import InvitationMessage, { InvitationType } from '../../classes/InvitationMessage';
import Player from '../../classes/Player';
import * as useCurrentPlayer from '../../hooks/useCurrentPlayer';
import InvitationItem from './InvitationItem';
import * as TestUtils from './TestUtils';

describe('InvitationItem', () => {
  const wrappedInvitationItemComponent = (invitation: InvitationMessage) => (
    <ChakraProvider>
      <React.StrictMode>
        <InvitationItem invitation={invitation} />
      </React.StrictMode>
    </ChakraProvider>
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
    invitations = [
      new InvitationMessage(
        `testingPlayerFrom-${nanoid()}`,
        `testingPlayerTo-${nanoid()}`,
        InvitationType.Friend,
        'Join my network!',
      ),
    ];
    currentPlayer = new Player(
      `testingPlayerID-${nanoid()}`,
      `testingPlayerUser-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      invitations,
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
    expect(renderData.queryByTestId('invitation-modal-header')).toHaveTextContent('Friend Request');
  });
  it('Deletes invitation when delete button is clicked on', async () => {
    const renderData = renderInvitationItem(invitations[0]);
    const deleteButton = await renderData.findByTestId('delete-invitation-button');
    expect(currentPlayer.invitations).toEqual(invitations);
    userEvent.click(deleteButton);
    expect(currentPlayer.invitations).toEqual([]);
  });
});
