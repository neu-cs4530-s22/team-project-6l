import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import Player from '../../classes/Player';
import {
  InvitationMessage,
  InvitationType,
  useAddFriendMutation,
  useDeleteFriendInvitationMutation,
} from '../../generated/graphql';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import usePlayersInTown from '../../hooks/usePlayersInTown';

type InvitationItemProps = {
  invitation: InvitationMessage;
};
/**
 * Displays a pending invitation, along with who the invitation is from and a button to delete it. When clicked on,
 * a modal pops up displaying a message included with the invitation and allows user to accept/reject the invitation.
 */
export default function InvitationItem({ invitation }: InvitationItemProps): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const playersInTown = usePlayersInTown();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, addFriend] = useAddFriendMutation();
  const [, deleteFriendInvitation] = useDeleteFriendInvitationMutation();

  const acceptInvitation = useCallback(async () => {
    onClose();
    if (InvitationType[invitation.invitationType] === 'Friend') {
      addFriend({
        username: invitation.fromEmail,
        friend: currentPlayer.email,
      });

      const fromIndex = playersInTown.findIndex(p => p.userName === invitation.from);
      if (fromIndex !== -1) {
        const newFriend = playersInTown[fromIndex];
        const newFriendProfile = Player.toFriendProfile(newFriend);
        currentPlayer.addFriend(newFriendProfile);

        deleteFriendInvitation({
          to: invitation.to.username,
          from: invitation.fromEmail,
        });
        currentPlayer.deleteInvitationFrom(invitation.from);
      }
    }
  }, [onClose, invitation, currentPlayer, addFriend, playersInTown, deleteFriendInvitation]);

  const rejectInvitation = useCallback(() => {
    onClose();
    currentPlayer.deleteInvitationFrom(invitation.from);
    deleteFriendInvitation({
      to: invitation.to.username,
      from: invitation.fromEmail,
    });
  }, [currentPlayer, invitation, onClose, deleteFriendInvitation]);

  const deleteInvitation = useCallback(() => {
    currentPlayer.deleteInvitationFrom(invitation.from);

    deleteFriendInvitation({
      to: invitation.to.username,
      from: invitation.fromEmail,
    });
  }, [currentPlayer, deleteFriendInvitation, invitation]);

  return (
    <Box>
      <Flex data-testid='invitation-item' onClick={onOpen} py={2}>
        <Center>
          <Text>{invitation.from}</Text>
        </Center>
        <Spacer />
        <Button data-testid='delete-invitation-button' onClick={deleteInvitation} size='sm' ms={2}>
          <Icon as={BsTrashFill} />
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader data-testid='invitation-modal-header' pb={0}>
            {invitation.invitationType === InvitationType.Friend
              ? 'Friend Invitation'
              : 'Town Join Invitation'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex my={2}>
              <Text fontWeight='bold' pe={1}>
                From:
              </Text>
              {invitation.from}
            </Flex>
            <Text fontWeight='bold' my={1} pe={1}>
              Message:
            </Text>
            {invitation.message || 'None'}
          </ModalBody>

          <ModalFooter>
            <Button
              data-testid='accept-invitation-button'
              colorScheme='blue'
              mr={3}
              onClick={acceptInvitation}>
              Accept
            </Button>
            <Button data-testid='reject-invitation-button' onClick={rejectInvitation}>
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
