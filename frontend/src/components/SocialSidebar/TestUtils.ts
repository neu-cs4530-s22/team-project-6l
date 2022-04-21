import { UserLocation } from '../../classes/Player';
import { Avatar } from '../../generated/graphql';

export function randomAvatar(): Avatar {
  const avatars = [
    Avatar.BubbleGum,
    Avatar.Dog,
    Avatar.Dragon,
    Avatar.SmileyFace,
    Avatar.ThreeSixty,
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

export function randomLocation(): UserLocation {
  return {
    moving: Math.random() < 0.5,
    rotation: 'front',
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  };
}
