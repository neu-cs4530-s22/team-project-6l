import { nanoid } from 'nanoid';
import { UserLocation } from '../../classes/Player';
import { Avatar, InvitationMessage, InvitationType, User } from '../../generated/graphql';

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

export function createFriendInvitationMessage(id: number): InvitationMessage {
  const user: User = {
    _id: nanoid(),
    createdAt: 'testDate',
    avatar: randomAvatar(),
    displayName: `testingPlayerToDisplay${id}-${nanoid()}`,
    email: `testingPlayerToEmail${id}-${nanoid()}`,
    username: `testingPlayerToUsername${id}-${nanoid()}`,
    friends: [],
    invitations: [],
    lastOnline: 'an hour ago',
  };
  return {
    from: `testingPlayerFrom${id}-${nanoid()}`,
    fromEmail: `testingPlayerFromEmail${id}-${nanoid()}`,
    invitationType: InvitationType.Friend,
    message: 'Be my friend',
    to: user,
  };
}
