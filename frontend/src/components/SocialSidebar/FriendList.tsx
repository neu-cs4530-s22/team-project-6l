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
import React, { useEffect, useState } from 'react';
import { IoMdContact } from 'react-icons/io';
import { FriendProfile, PlayerListener } from '../../classes/Player';
import { useGetFriendsQuery } from '../../generated/graphql';
import useCurrentPlayer from '../../hooks/useCurrentPlayer';
import PlayerName from './PlayerName';

/**
 * Lists the user's friends in a popover when friend button is clicked on. Subscribes to friend updates and
 * updates the rendered list of friends when it receives updates
 */
export default function FriendList(): JSX.Element {
  const currentPlayer = useCurrentPlayer();
  const [friends, setFriends] = useState(currentPlayer.friends);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, reexecuteQuery] = useGetFriendsQuery({
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
      const updatedFriends: FriendProfile[] = result.data?.user?.friends.map(f => ({
        _userName: f.displayName,
        _avatar: f.avatar,
        _email: f.username,
      }));
      setFriends(updatedFriends);
      currentPlayer.updateFriends(updatedFriends);
    }

    return () => clearTimeout(timerId);
  }, [isOpen, result.fetching, reexecuteQuery, result.data?.user, currentPlayer]);

  useEffect(() => {
    const updateListener: PlayerListener = {
      onFriendsChange: (newFriends: FriendProfile[]) => {
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
            <List ms={0}>
              {friends.map(friend => (
                <ListItem key={friend._email}>
                  <PlayerName userName={friend._userName} />
                </ListItem>
              ))}
            </List>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
