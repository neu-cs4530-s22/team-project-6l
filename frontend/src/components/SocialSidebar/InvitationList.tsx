import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { PlayerListener } from 'classes/Player';
import React, { useEffect, useState } from 'react';
import { IoMdMail } from 'react-icons/io';
import { InvitationMessage, useGetFriendInvitationsQuery } from '../../generated/graphql';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import InvitationItem from './InvitationItem';

/**
 * Lists the user's current pending invitations in a popover when invitation button is clicked on. Subscribes to
 * invitation updates and updates the rendered list of invitations when it receives updates
 */
export default function InvitationList(): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const [invitations, setInvitations] = useState(currentPlayer.invitations);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, reexecuteQuery] = useGetFriendInvitationsQuery({
    variables: {
      username: currentPlayer.email,
    },
    pause: true,
  });

  useEffect(() => {
    if (!isOpen || result.fetching) return undefined;

    const timerId = setTimeout(() => {
      reexecuteQuery({
        requestPolicy: 'cache-and-network',
      });
    }, 1000);

    if (result.data?.user) {
      const updatedInvitations = result.data?.user?.invitations;
      setInvitations(updatedInvitations as InvitationMessage[]);
    }

    return () => clearTimeout(timerId);
  }, [isOpen, result.fetching, reexecuteQuery, result.data?.user]);

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
      <Popover offset={[-70, 10]} isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
        <PopoverTrigger>
          <Button data-testid='invitation-button' size='sm' ms={2}>
            <Icon w={5} h={5} as={IoMdMail} />
          </Button>
        </PopoverTrigger>
        <PopoverContent width='200px'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight='bold'>Mailbox:</PopoverHeader>
          <PopoverBody>
            {invitations.length > 0 ? (
              <List ms={0}>
                {invitations.map(invitation => (
                  <ListItem key={invitation.fromEmail}>
                    <InvitationItem invitation={invitation} />
                  </ListItem>
                ))}
              </List>
            ) : (
              'No invitations :('
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
