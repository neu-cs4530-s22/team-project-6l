import assert from 'assert';
import { useContext } from 'react';
import UserContext, { UserUpdate } from '../contexts/UserContext';
import { User } from '../generated/graphql';

export default function useUserAccount(): {
  userState: User;
  userDispatch: React.Dispatch<UserUpdate>;
} {
  const context = useContext(UserContext);

  assert(context, 'User profile should be defined.');
  return context;
}
