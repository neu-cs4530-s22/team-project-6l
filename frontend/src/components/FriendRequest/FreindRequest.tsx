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
import React, { useCallback } from 'react';
import useMaybeVideo from '../../hooks/useMaybeVideo';

export default function FriendRequest(): JSX.Element {
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
      title: 'Friend request successfully sent!',
      status: 'success',
    });
    closeFriendRequest();
  }, [toast, closeFriendRequest]);

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
              <Textarea placeholder='Say something...' />
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
