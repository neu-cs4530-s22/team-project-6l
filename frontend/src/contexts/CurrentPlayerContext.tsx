import React from 'react';
import Player from '../classes/Player';

const Context = React.createContext<Player | null>(null);

export default Context;
