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
import { useAddFriendMutation, useRemoveInvitationMutation } from 'generated/graphql';
import useCurrentPlayer from 'hooks/useCurrentPlayer';
import React, { useCallback } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import InvitationMessage, { InvitationType } from '../../classes/InvitationMessage';

type InvitationItemProps = {
  invitation: InvitationMessage;
};
export default function InvitationItem({ invitation }: InvitationItemProps): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, addFriend] = useAddFriendMutation();
  const [, deleteFriendInvitation] = useRemoveInvitationMutation();

  const acceptInvitation = useCallback(() => {
    onClose();
    if (invitation.type === InvitationType.Friend) {
      currentPlayer.acceptFriendInvitationFrom(invitation.from);

      addFriend({
        username: invitation.from,
        friend: currentPlayer.userName,
      });
    }
    currentPlayer.acceptTownJoinInvitationFrom(invitation.from);
  }, [addFriend, currentPlayer, invitation, onClose]);

  const rejectInvitation = useCallback(() => {
    onClose();
    currentPlayer.rejectInvitationFrom(invitation.from);
  }, [currentPlayer, invitation, onClose]);

  const deleteInvitation = useCallback(() => {
    currentPlayer.rejectInvitationFrom(invitation.from);
    deleteFriendInvitation({
      username: invitation.toEmail,
      sender: invitation.fromEmail,
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
            {invitation.type === InvitationType.Friend ? 'Friend Request' : 'Town Join Invitation'}
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
