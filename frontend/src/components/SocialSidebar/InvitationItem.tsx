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
import {
  InvitationMessage,
  InvitationType,
  useAddFriendMutation,
  useDeleteFriendInvitationMutation,
} from '../../generated/graphql';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';

type InvitationItemProps = {
  invitation: InvitationMessage;
};
export default function InvitationItem({ invitation }: InvitationItemProps): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, addFriend] = useAddFriendMutation();
  const [, deleteFriendInvitation] = useDeleteFriendInvitationMutation();

  const acceptInvitation = useCallback(() => {
    onClose();
    if (InvitationType[invitation.invitationType] === 'Friend') {
      currentPlayer.acceptFriendInvitationFrom(invitation.from);

      addFriend({
        username: invitation.from,
        friend: currentPlayer.userName,
      });

      deleteFriendInvitation({
        to: invitation.to.username,
        from: invitation.fromEmail,
      });
    }
    currentPlayer.acceptTownJoinInvitationFrom(invitation.from);
  }, [addFriend, currentPlayer, invitation, onClose, deleteFriendInvitation]);

  const rejectInvitation = useCallback(() => {
    onClose();
    currentPlayer.rejectInvitationFrom(invitation.from);
    // const userId = `${invitation.to}`;
    deleteFriendInvitation({
      to: invitation.to.username,
      from: invitation.fromEmail,
    });
  }, [currentPlayer, invitation, onClose, deleteFriendInvitation]);

  const deleteInvitation = useCallback(() => {
    currentPlayer.rejectInvitationFrom(invitation.from);

    deleteFriendInvitation({
      to: invitation.to.username,
      from: invitation.fromEmail,
    });
  }, [currentPlayer, deleteFriendInvitation, invitation]);

  return (
    <Box>
      <Flex onClick={onOpen} py={2}>
        <Center>
          <Text>{invitation.from}</Text>
        </Center>
        <Spacer />
        <Button onClick={deleteInvitation} size='sm' ms={2}>
          <Icon as={BsTrashFill} />
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>
            {invitation.invitationType === InvitationType.Friend
              ? 'Friend Request'
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
            <Button colorScheme='blue' mr={3} onClick={acceptInvitation}>
              Accept
            </Button>
            <Button onClick={rejectInvitation}>Reject</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
