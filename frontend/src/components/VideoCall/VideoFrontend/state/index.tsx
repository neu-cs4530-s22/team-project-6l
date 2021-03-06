import UserContext, { UserUpdate } from 'contexts/UserContext';
import { Avatar, InvitationMessage, User } from 'generated/graphql';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { TwilioError } from 'twilio-video';
import { RecordingRules, RoomType } from '../types';
import {
  initialSettings,
  Settings,
  SettingsAction,
  settingsReducer,
} from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';

function UserStateReducer(state: User, update: UserUpdate): User {
  const nextState = {
    _id: state._id,
    email: state.email,
    avatar: state.avatar,
    createdAt: state.createdAt,
    lastOnline: state.lastOnline,
    displayName: state.lastOnline,
    username: state.username,
    friends: state.friends,
    invitations: state.invitations,
  };

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
      nextState.invitations = update.data.invitations;
      break;
    default:
      throw new Error('Unexpected state request ');
  }

  return nextState;
}

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

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(
    name: string,
    room: string,
    passcode?: string,
  ): Promise<{ room_type: RoomType; token: string }>;
  user?: { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  updateRecordingRules(room_sid: string, rules: RecordingRules): Promise<object>;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);
  const [userState, userDispatch] = useReducer(UserStateReducer, defaultUserState());

  const [roomType, setRoomType] = useState<RoomType>();

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    roomType,
  } as StateContextType;

  contextValue = {
    ...contextValue,
    getToken: async (user_identity, room_name) => {
      const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';

      return fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          user_identity,
          room_name,
          create_conversation: process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true',
        }),
      }).then(res => res.json());
    },
    updateRecordingRules: async (room_sid, rules) => {
      const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/recordingrules';

      return fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_sid, rules }),
        method: 'POST',
      })
        .then(async res => {
          const jsonResponse = await res.json();

          if (!res.ok) {
            const recordingError = new Error(
              jsonResponse.error?.message || 'There was an error updating recording rules',
            );
            recordingError.code = jsonResponse.error?.code;
            return Promise.reject(recordingError);
          }

          return jsonResponse;
        })
        .catch(err => setError(err));
    },
  };

  const getToken: StateContextType['getToken'] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  const updateRecordingRules: StateContextType['updateRecordingRules'] = (room_sid, rules) => {
    setIsFetching(true);
    return contextValue
      .updateRecordingRules(room_sid, rules)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, updateRecordingRules }}>
      <UserContext.Provider value={{ userState, userDispatch }}>
        {props.children}
      </UserContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
