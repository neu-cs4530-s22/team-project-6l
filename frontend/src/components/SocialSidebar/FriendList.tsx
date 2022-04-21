import {
  Box,
  Button,
  Icon,
  ListItem,
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
import React, { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import Player, { PlayerListener } from '../../classes/Player';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import PlayerName from './PlayerName';

export default function FriendList(): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const [friends, setFriends] = useState(currentPlayer.friends);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const updateListener: PlayerListener = {
      onFriendsChange: (newFriends: Player[]) => {
        setFriends(newFriends);
      },
    };
    currentPlayer.addListener(updateListener);
    return () => {
      currentPlayer.removeListener(updateListener);
    };
  }, [setFriends, currentPlayer]);

  return (
    <Box>
      <Popover offset={[-15, 10]} isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button data-testid='friend-button' onClick={onOpen} size='sm' mx={1}>
            <Icon w={5} h={5} as={IoMdContact} />
          </Button>
        </PopoverTrigger>
        <PopoverContent width='200px'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight='bold'>Friends:</PopoverHeader>
          <PopoverBody>
            <UnorderedList ms={0}>
              {friends.map(friend => (
                <ListItem key={friend.id}>
                  <PlayerName player={friend} />
                </ListItem>
              ))}
            </UnorderedList>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
