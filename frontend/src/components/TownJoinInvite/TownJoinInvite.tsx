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
  Select,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import useCurrentPlayer from 'hooks/useCurrentPlayer';
import React, { useCallback, useState } from 'react';
import useMaybeVideo from '../../hooks/useMaybeVideo';

export default function TownJoinInvite(): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const [inviteMessage, setInviteMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const video = useMaybeVideo();
  const toast = useToast();

  const disableSpace = useCallback((e: KeyboardEvent) => {
    // diable create conversation area when friend request modal is open
    if (e.key === ' ') {
      e.stopPropagation();
    }
  }, []);

  const openTownJoinInvite = useCallback(() => {
    onOpen();
    video?.pauseGame();
    document.addEventListener('keydown', disableSpace);
  }, [onOpen, video, disableSpace]);

  const closeTownJoinInvite = useCallback(() => {
    onClose();
    video?.unPauseGame();
    document.removeEventListener('keydown', disableSpace);
  }, [onClose, video, disableSpace]);

  const sendTownJoinInvite = useCallback(() => {
    // TODO: call backend to send friend request
    toast({
      title: `Sent town join invite with message: ${inviteMessage}`,
      status: 'success',
    });
    closeTownJoinInvite();
  }, [toast, closeTownJoinInvite, inviteMessage]);

  return (
    <Box>
      <Button onClick={openTownJoinInvite} size='sm'>
        Add Friend
      </Button>

      <Modal isOpen={isOpen} onClose={closeTownJoinInvite} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Friend Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentPlayer?.friends.length === 0 ? (
              <Text>You can only invite your friends to join your town, go make some friends!</Text>
            ) : (
              <FormControl>
                <FormLabel>Friend</FormLabel>
                <Select placeholder='Select friend to invite'>
                  {currentPlayer.friends.map(friend => (
                    <option key={friend?.id} value={friend?.id}>
                      {friend?.userName}
                    </option>
                  ))}
                </Select>
                <FormLabel>Add a message:</FormLabel>
                <Textarea
                  placeholder='Say something...'
                  onChange={event => setInviteMessage(event.target.value)}
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={sendTownJoinInvite}>
              Send
            </Button>
            <Button onClick={closeTownJoinInvite}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
