import { useContext } from 'react';
import assert from 'assert';
import { User } from '../generated/graphql';
import UserContext, { UserUpdate } from '../contexts/UserContext';

export default function useUserAccount(): {
  userState: User;
  userDispatch: React.Dispatch<UserUpdate>;
} {
  const context = useContext(UserContext);

  assert(context, 'User profile should be defined.');
  return context;
}
