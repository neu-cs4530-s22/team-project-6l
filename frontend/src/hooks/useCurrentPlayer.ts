import assert from 'assert';
import Player from 'classes/Player';
import { useContext } from 'react';
import CurrentPlayerContext from '../contexts/CurrentPlayerContext';

/**
 * Use this hook to access the current player.
 *
 * Use this hook if your component can only render when the user is logged in.
 * Otherwise, use the `useMaybeCurrentPlayer` hook.
 */
export default function useCurrentPlayer(): Player {
  const ctx = useContext(CurrentPlayerContext);
  assert(ctx, 'Current Player should be defined.');
  return ctx;
}
