import assert from 'assert';
import { Socket } from 'socket.io';
import {
  ConversationAreaCreateRequest,
  ServerConversationArea,
} from '../client/TownsServiceClient';
import { ChatMessage, CoveyTownList, UserLocation } from '../CoveyTypes';
import CoveyTownsStore from '../lib/CoveyTownsStore';
import Avatar from '../types/Avatar';
import CoveyTownListener from '../types/CoveyTownListener';
import InvitationMessage from '../types/InvitationMessage';
import Player from '../types/Player';

export interface UserEmailOfUser {
  userName: string;
}

/**
 * The format of a request to add a friend based on the username of the friend currently present in the CoveyTown into the friend list
 */
export interface FriendAdd {
  userName: string;
  friendUserName: string;
}

/**
 * The format of a request to remove a friend based on the username of the friend currently present in the CoveyTown out of the friend list
 */
export interface FriendRemove {
  userName: string;
  friendUserName: string;
}

/**
 * The format of a request to join a Town in Covey.Town, as dispatched by the server middleware
 */
export interface TownJoinRequest {
  /** userName of the player that would like to join * */
  userName: string;
  /** ID of the town that the player would like to join * */
  coveyTownID: string;
  /** avatar of the player that would  like to join * */
  avatar: Avatar;
  /** Unique email ID to distinguish player */
  email: string;
}

/**
 * The format of a response to join a Town in Covey.Town, as returned by the handler to the server
 * middleware
 */
export interface TownJoinResponse {
  /** Unique ID that represents this player * */
  coveyUserID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  coveySessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: Player[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Conversation areas currently active in this town */
  conversationAreas: ServerConversationArea[];
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface TownCreateRequest {
  friendlyName: string;
  isPubliclyListed: boolean;
}

/**
 * Response from the server for a Town create request
 */
export interface TownCreateResponse {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Response from the server for a Town list request
 */
export interface TownListResponse {
  towns: CoveyTownList;
}

/**
 * Payload sent by the client to delete a Town
 */
export interface TownDeleteRequest {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Payload sent by the client to update a Town.
 * N.B., JavaScript is terrible, so:
 * if(!isPubliclyListed) -> evaluates to true if the value is false OR undefined, use ===
 */
export interface TownUpdateRequest {
  coveyTownID: string;
  coveyTownPassword: string;
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

/**
 * A handler to process a player's request to join a town. The flow is:
 *  1. Client makes a TownJoinRequest, this handler is executed
 *  2. Client uses the sessionToken returned by this handler to make a subscription to the town,
 *  @see townSubscriptionHandler for the code that handles that request.
 *
 * @param requestData an object representing the player's request
 */
export async function townJoinHandler(
  requestData: TownJoinRequest,
): Promise<ResponseEnvelope<TownJoinResponse>> {
  const townsStore = CoveyTownsStore.getInstance();
  const database = CoveyTownsStore.getDatabase();

  const coveyTownController = townsStore.getControllerForTown(requestData.coveyTownID);
  if (!coveyTownController) {
    return {
      isOK: false,
      message: 'Error: No such town',
    };
  }

  const existingPlayer = await database.getUser(requestData.email);
  let newPlayer;

  if (!existingPlayer) {
    newPlayer = new Player(requestData.userName, requestData.email, requestData.avatar);
  } else {
    newPlayer = new Player(
      requestData.userName,
      requestData.email,
      existingPlayer.avatar,
      existingPlayer.friends.isInitialized()
        ? existingPlayer.friends.getItems().map(u => new Player(u.displayName, u.email, u.avatar))
        : [],
      existingPlayer.invitations.isInitialized() ? existingPlayer.invitations.getItems() : [],
    );
  }

  const newSession = await coveyTownController.addPlayer(newPlayer);
  assert(newSession.videoToken);
  return {
    isOK: true,
    response: {
      coveyUserID: newPlayer.id,
      coveySessionToken: newSession.sessionToken,
      providerVideoToken: newSession.videoToken,
      currentPlayers: coveyTownController.players,
      friendlyName: coveyTownController.friendlyName,
      isPubliclyListed: coveyTownController.isPubliclyListed,
      conversationAreas: coveyTownController.conversationAreas,
    },
  };
}

export function townListHandler(): ResponseEnvelope<TownListResponse> {
  const townsStore = CoveyTownsStore.getInstance();
  return {
    isOK: true,
    response: { towns: townsStore.getTowns() },
  };
}

export function townCreateHandler(
  requestData: TownCreateRequest,
): ResponseEnvelope<TownCreateResponse> {
  const townsStore = CoveyTownsStore.getInstance();
  if (requestData.friendlyName.length === 0) {
    return {
      isOK: false,
      message: 'FriendlyName must be specified',
    };
  }
  const newTown = townsStore.createTown(requestData.friendlyName, requestData.isPubliclyListed);
  return {
    isOK: true,
    response: {
      coveyTownID: newTown.coveyTownID,
      coveyTownPassword: newTown.townUpdatePassword,
    },
  };
}

export function townDeleteHandler(
  requestData: TownDeleteRequest,
): ResponseEnvelope<Record<string, null>> {
  const townsStore = CoveyTownsStore.getInstance();
  const success = townsStore.deleteTown(requestData.coveyTownID, requestData.coveyTownPassword);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Invalid password. Please double check your town update password.'
      : undefined,
  };
}

export function townUpdateHandler(
  requestData: TownUpdateRequest,
): ResponseEnvelope<Record<string, null>> {
  const townsStore = CoveyTownsStore.getInstance();
  const success = townsStore.updateTown(
    requestData.coveyTownID,
    requestData.coveyTownPassword,
    requestData.friendlyName,
    requestData.isPubliclyListed,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Invalid password or update values specified. Please double check your town update password.'
      : undefined,
  };
}

/**
 * A handler to process the "Create Conversation Area" request
 * The intended flow of this handler is:
 * * Fetch the town controller for the specified town ID
 * * Validate that the sessionToken is valid for that town
 * * Ask the TownController to create the conversation area
 * @param _requestData Conversation area create request
 */
export function conversationAreaCreateHandler(
  _requestData: ConversationAreaCreateRequest,
): ResponseEnvelope<Record<string, null>> {
  const townsStore = CoveyTownsStore.getInstance();
  const townController = townsStore.getControllerForTown(_requestData.coveyTownID);
  if (!townController?.getSessionByToken(_requestData.sessionToken)) {
    return {
      isOK: false,
      response: {},
      message: `Unable to create conversation area ${_requestData.conversationArea.label} with topic ${_requestData.conversationArea.topic}`,
    };
  }
  const success = townController.addConversationArea(_requestData.conversationArea);

  return {
    isOK: success,
    response: {},
    message: !success
      ? `Unable to create conversation area ${_requestData.conversationArea.label} with topic ${_requestData.conversationArea.topic}`
      : undefined,
  };
}

/**
 * An adapter between CoveyTownController's event interface (CoveyTownListener)
 * and the low-level network communication protocol
 *
 * @param socket the Socket object that we will use to communicate with the player
 */
function townSocketAdapter(socket: Socket): CoveyTownListener {
  return {
    onPlayerMoved(movedPlayer: Player) {
      socket.emit('playerMoved', movedPlayer);
    },
    onPlayerDisconnected(removedPlayer: Player) {
      socket.emit('playerDisconnect', removedPlayer);
    },
    onPlayerJoined(newPlayer: Player) {
      socket.emit('newPlayer', newPlayer);
    },
    onTownDestroyed() {
      socket.emit('townClosing');
      socket.disconnect(true);
    },
    onConversationAreaDestroyed(conversation: ServerConversationArea) {
      socket.emit('conversationDestroyed', conversation);
    },
    onConversationAreaUpdated(conversation: ServerConversationArea) {
      socket.emit('conversationUpdated', conversation);
    },
    onChatMessage(message: ChatMessage) {
      socket.emit('chatMessage', message);
    },
    onInvitationSent(invitation: InvitationMessage) {
      socket.emit('invitationSent', invitation);
    },
  };
}

/**
 * Represents the request handler to, based on the current presence of the username in the list of the current online
 * players in the covey town, be able to have the feature of sending friend requests and accepting the friend requests and
 * therefore updating the list of the friends based on the user choice
 * @param requestData
 * @returns
 */
export async function FriendListHandler(
  requestData: UserEmailOfUser,
): Promise<ResponseEnvelope<UserEmailOfUser>> {
  // Represents fetching the instance of the given data base from the covey town store to use to extract the information of the user
  // from the data base produced that includes the names of the user and the friend that is trying to be added by creating an instance
  // of the MikroORM class and then using this to connect and extract from the database and working with qeuries
  // Represents connecting to the database to extract the information to use
  const currentPlayer = await CoveyTownsStore.getDatabase().getUser(requestData.userName);

  if (currentPlayer?.email) {
    return {
      isOK: true,
      // Represents returning a list of all of the friends of the given user
      response: {
        userName: currentPlayer?.email,
      },
    };
  }

  return {
    isOK: false,
    response: {
      userName: 'None',
    },
  };
}

// IGNORE SECTION: See comment in RequestHandler.test.ts. We scratched the initial implementation
// of friend and invitation handlers and revamped it.

// /**
//  * Represents the request handler to, based on the current presence of the username in the list of the current online
//  * players in the covey town, be able to have the feature of sending friend requests and accepting the friend requests and
//  * therefore updating the list of the friends based on the user choice
//  * @param requestData
//  * @returns
//  */
// export async function friendIsAddedHandler(
//   requestData: FriendAdd,
// ): Promise<ResponseEnvelope<Record<string, null>>> {
//   // Represents fetching the instance of the given data base from the covey town store to use to extract the information of the user
//   // from the data base produced that includes the names of the user and the friend that is trying to be added by creating an instance
//   // of the MikroORM class and then using this to connect and extract from the database and working with qeuries
//   // Represents connecting to the database to extract the information to use
//   // Represents fetching yourself through your own email
//   const playerUser = await CoveyTownsStore.getDatabase().getUser(requestData.userName);
//   // check if the person with this email-id exists in the database
//   // Represents checking if the given friend exists with the user email given
//   const friendUser = await CoveyTownsStore.getDatabase().getUser(requestData.friendUserName);

//   // Represents if the friend is already a friend
//   if (friendUser) {
//     playerUser?.friends.add(friendUser);
//     return {
//       isOK: true,
//       response: {},
//       message: 'Friend is successfully added to your list of friends',
//     };
//   }
//   return {
//     isOK: false,
//     response: {},
//     message: 'Friend cannot added to your list of friends',
//   };
// }

// /**
//  * Represents the request handler to, based on the current presence of the username in the list of the current online
//  * players in the covey town, be able to have the feature of sending friend requests and accepting the friend requests and
//  * therefore updating the list of the friends based on the user choice
//  * @param requestData
//  * @returns
//  */
// export async function friendIsRemovedHandler(
//   requestData: FriendRemove,
// ): Promise<ResponseEnvelope<Record<string, null>>> {
//   // Represents fetching the instance of the given data base from the covey town store to use to extract the information of the user
//   // from the data base produced that includes the names of the user and the friend that is trying to be added by creating an instance
//   // of the MikroORM class and then using this to connect and extract from the database and working with qeuries
//   // Represents connecting to the database to extract the information to use
//   const player = await CoveyTownsStore.getDatabase().getUser(requestData.userName);
//   const friend = await CoveyTownsStore.getDatabase().getUser(requestData.friendUserName);

//   return {
//     isOK: true,
//     message: `Friend with username ${friend?.displayName} succesfully removed from ${player?.displayName}'list of friends.`,
//   };
// }

// // Represents the function that takes in the player into consideration and simply deletes a player based on if they are in the data base
// // in the case of which, this function will be used for testing purposes
// export async function deletesPlayer(
//   requestData: UserEmailOfUser,
// ): Promise<ResponseEnvelope<Record<string, null>>> {
//   // Represents fetching the playerClient that interacts with the data base and uses this to extract the player information and deletes
//   // them from the list of players in the database
//   // await friendMigration.em.delete the user from the database
//   // friendMigration.close();
//   const player = await CoveyTownsStore.getDatabase().getUser(requestData.userName);
//   return {
//     isOK: true,
//     message: `Player ${player?.displayName} from the user database is deleted`,
//   };
// }

// // Represents the function that takes in the player into consideration and simply adds a player based on if they are in the data base
// // in the case of which, this function will be used for testing purposes
// export async function addsPlayer(
//   requestData: UserEmailOfUser,
// ): Promise<ResponseEnvelope<Record<string, null>>> {
//   // Represents fetching the playerClient that interacts with the data base and uses this to extract the player information and adds
//   // them from the list of players in the database
//   // Represents getting the player out and checking if they are already in the list
//   // Represents checking whether the player is already in the list and if not, add it into the database and close the friendMigration client
//   const player = await CoveyTownsStore.getDatabase().getUser(requestData.userName);

//   return {
//     isOK: true,
//     message: `Player ${player?.displayName} has been added`,
//   };
// }

/**
 * A handler to process a remote player's subscription to updates for a town
 *
 * @param socket the Socket object that we will use to communicate with the player
 */
export function townSubscriptionHandler(socket: Socket): void {
  // Parse the client's session token from the connection
  // For each player, the session token should be the same string returned by joinTownHandler
  const { token, coveyTownID } = socket.handshake.auth as { token: string; coveyTownID: string };

  const townController = CoveyTownsStore.getInstance().getControllerForTown(coveyTownID);

  // Retrieve our metadata about this player from the TownController
  const s = townController?.getSessionByToken(token);
  if (!s || !townController) {
    // No valid session exists for this token, hence this client's connection should be terminated
    socket.disconnect(true);
    return;
  }

  // Create an adapter that will translate events from the CoveyTownController into
  // events that the socket protocol knows about
  const listener = townSocketAdapter(socket);
  townController.addTownListener(listener);

  // Register an event listener for the client socket: if the client disconnects,
  // clean up our listener adapter, and then let the CoveyTownController know that the
  // player's session is disconnected
  socket.on('disconnect', () => {
    townController.removeTownListener(listener);
    townController.destroySession(s);
  });

  socket.on('chatMessage', (message: ChatMessage) => {
    townController.onChatMessage(message);
  });

  // Register an event listener for the client socket: if the client updates their
  // location, inform the CoveyTownController
  socket.on('playerMovement', (movementData: UserLocation) => {
    townController.updatePlayerLocation(s.player, movementData);
  });
}
