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
  const defaultInviteMessage = "Join the town I'm in!";
  const currentPlayer = useCurrentPlayer();
  const [friendID, setFriendID] = useState('');
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
    setInviteMessage(defaultInviteMessage);
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
    // TODO: call backend to send town join invite
    toast({
      title: `Successfully sent town join invite to ${friendID}`,
      status: 'success',
    });
    closeTownJoinInvite();
  }, [toast, closeTownJoinInvite, friendID]);

  return (
    <Box>
      <Button onClick={openTownJoinInvite} size='sm'>
        Invite Your Friend
      </Button>

      <Modal isOpen={isOpen} onClose={closeTownJoinInvite} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Friend to Join Town</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentPlayer?.friends.length === 0 ? (
              <Text>You can only invite your friends to join your town, go make some friends!</Text>
            ) : (
              <FormControl>
                <FormLabel>Your Freind</FormLabel>
                <Select
                  id='friend-selection'
                  placeholder='Select friend to invite'
                  onChange={event => setFriendID(event.target.value)}>
                  {currentPlayer.friends.map((friend, i) => (
                    <option selected={i === 0} key={friend?.id} value={friend?.id}>
                      {friend?.userName}
                    </option>
                  ))}
                </Select>
                <FormLabel my={2}>Add a message:</FormLabel>
                <Textarea
                  value={inviteMessage}
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
