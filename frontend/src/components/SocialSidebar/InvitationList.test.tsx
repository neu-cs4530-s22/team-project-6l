import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { never } from 'wonka';
import { nanoid } from 'nanoid';
import React from 'react';
import { Client, Provider } from 'urql';
import { InvitationMessage } from '../../generated/graphql';
import Player from '../../classes/Player';
import * as useCurrentPlayer from '../../hooks/useCurrentPlayer';
import * as InvitationItem from './InvitationItem';
import InvitationList from './InvitationList';
import * as TestUtils from './TestUtils';

describe('InvitationList', () => {
  const wrappedInvitationListComponent = () => (
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
          <InvitationList />
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
  const renderInvitationList = () => render(wrappedInvitationListComponent());
  let useCurrentPlayerSpy: jest.SpyInstance<Player, []>;
  let currentPlayer: Player;
  let invitations: InvitationMessage[];

  const expectProperlyRenderedInvitationList = async (
    renderData: RenderResult,
    invitationsToExpect: InvitationMessage[],
  ) => {
    const invitationButton = await renderData.findByTestId('invitation-button');
    userEvent.click(invitationButton);

    await waitFor(async () => {
      const invitationEntries = await renderData.findAllByRole('listitem');
      expect(invitationEntries.length).toBe(invitationsToExpect.length); // expect same number of friends

      const invitationsTextContent = invitationsToExpect.map(i => i.from);
      for (let i = 0; i < invitationsTextContent.length; i += 1) {
        expect(invitationEntries[i]).toHaveTextContent(invitationsTextContent[i]);
        const parentComponent = invitationEntries[i].parentNode;
        if (parentComponent) {
          expect(parentComponent.nodeName).toBe('UL'); // list items expected to be directly nested in a list
        }
      }
    });
  };
  beforeAll(() => {
    useCurrentPlayerSpy = jest.spyOn(useCurrentPlayer, 'default');
  });
  beforeEach(() => {
    invitations = [];
    for (let i = 0; i < 5; i += 1) {
      invitations.push(TestUtils.createFriendInvitationMessage(i));
    }
    currentPlayer = new Player(
      `testingPlayerID0-${nanoid()}`,
      `testingPlayerUser0-${nanoid()}}`,
      TestUtils.randomLocation(),
      TestUtils.randomAvatar(),
      [],
      invitations,
      `testingPlayerEmail0-${nanoid()}`,
    );
    useCurrentPlayerSpy.mockReturnValue(currentPlayer);
  });
  afterAll(() => {
    useCurrentPlayerSpy.mockRestore();
  });
  it("Renders a list of all invitations'", async () => {
    const renderData = renderInvitationList();
    await expectProperlyRenderedInvitationList(renderData, invitations);
  });
  it('Renders the invitations in a InvitationItem component', async () => {
    const mockInvitationItem = jest.spyOn(InvitationItem, 'default');
    try {
      renderInvitationList();
      await waitFor(() => {
        expect(mockInvitationItem).toHaveBeenCalled();
      });
    } finally {
      mockInvitationItem.mockRestore();
    }
  });
  it('Does not mutate the invitations of the player returned by useCurrentPlayer', async () => {
    invitations.reverse();
    const copyOfArrayPassedToComponent = invitations.concat([]);
    const renderData = renderInvitationList();
    await expectProperlyRenderedInvitationList(renderData, invitations);
    expect(invitations).toEqual(copyOfArrayPassedToComponent); // expect that the invitations array is unchanged by the compoennt
  });
});
