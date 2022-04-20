import React from 'react';
import { Avatar, InvitationMessage, User } from '../generated/graphql';

function defaultUserState(): User {
  return {
    _id: '',
    email: '',
    avatar: Avatar.Dog,
    createdAt: '',
    lastOnline: '',
    displayName: '',
    username: '',
    friends: new Array<User>(),
    invitations: new Array<InvitationMessage>(),
  };
}
export type UserUpdate =
  | {
      action: 'registerUser';
      data: {
        _id: string;
        email: string;
        avatar: Avatar;
        createdAt: string;
        lastOnline: string;
        displayName: string;
        username: string;
        friends: Array<User>;
        invitations: Array<InvitationMessage>;
      };
    }
  | { action: 'deleteUser' };

const defaultDispatch: React.Dispatch<UserUpdate> = () => defaultUserState(); // we never actually use this

const Context = React.createContext({
  userState: defaultUserState(),
  userDispatch: defaultDispatch,
});

export default Context;
