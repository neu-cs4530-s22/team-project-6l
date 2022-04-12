import { Flex, Heading, Spacer, StackDivider, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import ConversationAreasList from './ConversationAreasList';
import FriendList from './FriendList';
import InvitationList from './InvitationList';
import PlayersList from './PlayersList';
import TownJoinInvite from './TownJoinInvite';

export default function SocialSidebar(): JSX.Element {
  const { currentTownFriendlyName, currentTownID } = useCoveyAppState();
  return (
    <VStack
      align='left'
      spacing={2}
      border='2px'
      padding={2}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={<StackDivider borderColor='gray.200' />}
      borderRadius='4px'>
      <Flex>
        <Spacer />
        <FriendList />
        <InvitationList />
      </Flex>
      <VStack align='left' spacing={2}>
        <Tooltip label={`Town ID: ${currentTownID}`}>
          <Heading fontSize='xl' as='h1'>
            Current town: {currentTownFriendlyName}
          </Heading>
        </Tooltip>
        <TownJoinInvite />
      </VStack>
      <PlayersList />
      <ConversationAreasList />
    </VStack>
  );
}
