import React from 'react';
import { Avatar, User } from '../generated/graphql';

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
        _id: string;
        email: string;
        avatar: Avatar;
        createdAt: string;
        lastOnline: string;
        displayName: string;
        username: string;
        friends: Array<User>;
      };
    }
  | { action: 'deleteUser' };

// export function createCtx<StateType, ActionType>(
//   reducer: React.Reducer<StateType, ActionType>,
//   initialState: StateType,
// ) {
//   const defaultDispatch: React.Dispatch<ActionType> = () => initialState // we never actually use this
//   const userCtx = React.createContext({
//     userState: initialState,
//     userDispatch: defaultDispatch, // just to mock out the dispatch type and make it not optioanl
//   })
//   function UserProvider(props: React.PropsWithChildren<unknown>) {
//     const [userState, userDispatch] = React.useReducer<React.Reducer<StateType, ActionType>>(reducer, initialState)
//     return <userCtx.Provider value={{ userState, userDispatch }} {...props} />
//   }
//   return [userCtx, UserProvider] as const
// }

// const [UserCtx, UserProvider] = createCtx(UserStateReducer, defaultUserState());

// export { UserCtx, UserProvider };

const defaultDispatch: React.Dispatch<UserUpdate> = () => defaultUserState(); // we never actually use this

const Context = React.createContext({
  userState: defaultUserState(),
  userDispatch: defaultDispatch,
});

export default Context;
