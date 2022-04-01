import { Heading, StackDivider, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import TownJoinInvite from '../TownJoinInvite/TownJoinInvite';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';

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
      <Tooltip label={`Town ID: ${currentTownID}`}>
        <Heading fontSize='xl' as='h1'>
          Current town: {currentTownFriendlyName}
        </Heading>
      </Tooltip>
      <PlayersList />
      <ConversationAreasList />
      <TownJoinInvite />
    </VStack>
  );
}
