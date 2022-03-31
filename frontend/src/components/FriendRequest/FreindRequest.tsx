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
} from '@chakra-ui/react';
import React from 'react';

export default function FriendRequest(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // TODO: figure out how to disable key events
  //   const keyboardHandler = (e: KeyboardEvent) => {

  //   };
  //   useEffect(() => {
  //     document.addEventListener('keydown', keyboardHandler, true);
  //     return () => {
  //       document.removeEventListener('keydown', keyboardHandler, true);
  //     };
  //   }, []);
  return (
    <Box>
      <Button onClick={onOpen} size='sm'>
        Add Friend
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
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
            <Button colorScheme='blue' mr={3}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
