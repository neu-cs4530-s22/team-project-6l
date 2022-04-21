import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useSendFriendInvitationMutation } from '../../generated/graphql';
import useMaybeVideo from '../../hooks/useMaybeVideo';
import useUserAccount from '../../hooks/useUserAccount';

type FriendRequestProps = {
  username: string;
  email: string;
};
export default function FriendRequest({ username, email }: FriendRequestProps): JSX.Element {
  const [requestMessage, setRequestMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, sendInvitation] = useSendFriendInvitationMutation();
  const { userState } = useUserAccount();
  const video = useMaybeVideo();
  const toast = useToast();

  const disableSpace = useCallback((e: KeyboardEvent) => {
    // diable create conversation area when friend request modal is open
    if (e.key === ' ') {
      e.stopPropagation();
    }
  }, []);

  const openFriendRequest = useCallback(() => {
    onOpen();
    video?.pauseGame();
    document.addEventListener('keydown', disableSpace);
  }, [onOpen, video, disableSpace]);

  const closeFriendRequest = useCallback(() => {
    onClose();
    video?.unPauseGame();
    document.removeEventListener('keydown', disableSpace);
  }, [onClose, video, disableSpace]);

  const sendFriendRequest = useCallback(() => {
    sendInvitation({
      from: userState.email,
      to: email,
      message: requestMessage,
    });

    toast({
      title: `Sent friend request to ${username} with message: ${requestMessage}`,
      status: 'success',
    });
    closeFriendRequest();
  }, [toast, closeFriendRequest, username, requestMessage, sendInvitation, userState, email]);

  return (
    <Box>
      <Button onClick={openFriendRequest} size='sm'>
        Add Friend
      </Button>

      <Modal isOpen={isOpen} onClose={closeFriendRequest} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Friend Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Add a message:</FormLabel>
              <Textarea
                placeholder='Say something...'
                onChange={event => setRequestMessage(event.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={sendFriendRequest}>
              Send
            </Button>
            <Button onClick={closeFriendRequest}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
