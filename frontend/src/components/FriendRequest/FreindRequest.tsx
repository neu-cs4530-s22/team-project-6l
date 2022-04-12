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
import useMaybeVideo from '../../hooks/useMaybeVideo';

type FreindRequestProps = {
  username: string;
};
export default function FriendRequest({ username }: FreindRequestProps): JSX.Element {
  const [requestMessage, setRequestMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    // TODO: call backend to send friend request
    toast({
      title: `Sent friend request to ${username} with message: ${requestMessage}`,
      status: 'success',
    });
    closeFriendRequest();
  }, [toast, closeFriendRequest, username, requestMessage]);

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
