/* eslint-disable react/jsx-props-no-spreading */

import { Avatar, User } from 'generated/graphql';
import React from 'react';


function UserStateReducer(state: User, update: UserUpdate): User {
  const nextState = {
    _id: state._id,
    email: state.email,
    avatar: state.avatar,
    createdAt: state.createdAt,
    lastOnline: state.lastOnline,
    displayName: state.lastOnline,
    username: state.username,
    friends: state.friends
  }

  switch (update.action) {
    case 'registerUser':
      nextState._id = update.data._id;
      nextState.email = update.data.email;
      nextState.avatar = update.data.avatar;
      nextState.createdAt = update.data.createdAt;
      nextState.lastOnline = update.data.lastOnline;
      nextState.displayName = update.data.displayName;
      nextState.username = update.data.username;
      nextState.friends = update.data.friends;
      break;
    default:
      throw new Error('Unexpected state request ')
  }

  return nextState;
};

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
  };
}
export type UserUpdate =
  | {
    action: 'registerUser';
    data: {
      _id: string,
      email: string,
      avatar: Avatar,
      createdAt: string,
      lastOnline: string,
      displayName: string,
      username: string,
      friends: Array<User>,
    };
  }
  | { action: 'deleteUser' };



export function createCtx<StateType, ActionType>(
  reducer: React.Reducer<StateType, ActionType>,
  initialState: StateType,
) {
  const defaultDispatch: React.Dispatch<ActionType> = () => initialState // we never actually use this
  const userCtx = React.createContext({
    userState: initialState,
    userDispatch: defaultDispatch, // just to mock out the dispatch type and make it not optioanl
  })
  function UserProvider(props: React.PropsWithChildren<unknown>) {
    const [userState, userDispatch] = React.useReducer<React.Reducer<StateType, ActionType>>(reducer, initialState)
    return <userCtx.Provider value={{ userState, userDispatch }} {...props} />
  }
  return [userCtx, UserProvider] as const
}

const [UserCtx, UserProvider] = createCtx(UserStateReducer, defaultUserState());

export { UserCtx, UserProvider };