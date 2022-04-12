import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import InvitationMessage from 'classes/InvitationMessage';
import { PlayerListener } from 'classes/Player';
import React, { useEffect, useState } from 'react';
import { IoMdMail } from 'react-icons/io';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import InvitationItem from './InvitationItem';

export default function InvitationList(): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const [invitations, setInvitations] = useState(currentPlayer.invitations);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const updateListener: PlayerListener = {
      onInvitationsChange: (newInvitations: InvitationMessage[]) => {
        setInvitations(newInvitations);
      },
    };
    currentPlayer.addListener(updateListener);
    return () => {
      currentPlayer.removeListener(updateListener);
    };
  }, [setInvitations, currentPlayer]);

  return (
    <Box>
      <Popover offset={[-70, 10]} isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button onClick={onOpen} size='sm' ms={2}>
            <Icon w={5} h={5} as={IoMdMail} />
          </Button>
        </PopoverTrigger>
        <PopoverContent width='200px'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight='bold'>Mailbox:</PopoverHeader>
          <PopoverBody>
            <UnorderedList ms={0}>
              {invitations.map(invitation => (
                <InvitationItem key={invitation.from} invitation={invitation} />
              ))}
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
