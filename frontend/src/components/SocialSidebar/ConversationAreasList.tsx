import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ConversationArea, { ConversationAreaListener, NO_TOPIC_STRING } from '../../classes/ConversationArea';
import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerItem from './PlayerItem';

type ConversationAreaViewProps = {
  area: ConversationArea;
};
/**
 * Displays an "active" conversation area, along with its occupants. Subscribes to occupancy updates 
 * and updates the rendered list of occupants when it receives updates
 */
function ConversationAreaView({ area }: ConversationAreaViewProps): JSX.Element {
  const [occupants, setOccupants] = useState<string[]>(area.occupants);
  const players = usePlayersInTown();

  useEffect(() => {
    const updateListener: ConversationAreaListener = {
      onOccupantsChange: (newOccupants: string[]) => {
        setOccupants(newOccupants);
      }
    };
    area.addListener(updateListener);
    return () => {
      area.removeListener(updateListener);
    };
  }, [setOccupants, area]);

  return (
    <Box>
      <Heading as='h3' fontSize='m'>{area.label}: {area.topic}</Heading>
      <UnorderedList>
        {occupants.map(occupant => {
          const player = players.find(eachPlayer => eachPlayer.id === occupant);
          if(!player)
            return <span key={occupant} />;
          return <ListItem key={occupant}><PlayerItem player={player} /></ListItem>
      })}
      </UnorderedList>
    </Box>
  );
}

/**
 * Displays a list of "active" conversation areas, along with their occupants 
 * 
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 * 
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
export default function ConversationAreasList(): JSX.Element {
  const conversationAreas = useConversationAreas();
  const activeConversationAreas = conversationAreas.filter(eachArea => eachArea.topic !== NO_TOPIC_STRING);
  return (
    <Box>
      <Heading as='h2' fontSize='l'>Active Conversation Areas:</Heading>
      { activeConversationAreas.length === 0 ? <>No active conversation areas</>: 
        activeConversationAreas
        .sort((a1, a2) => a1.label.localeCompare(a2.label, undefined, {numeric: true, sensitivity: 'base'}))
        .map(area => (
          <ConversationAreaView area={area} key={area.label} />
        ))}
    </Box>
  );
}