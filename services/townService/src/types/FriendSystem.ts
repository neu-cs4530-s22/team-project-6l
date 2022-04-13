import { ServerConversationArea } from '../client/TownsServiceClient';
import { onlineActivity, UserLocation } from '../CoveyTypes';
import Player from './Player';

/**
 * Each user who is connected to a town is represented by a Player object
 */
export default class FriendSystem {
  /** The current location of this user in the world map * */
  public isOnline: onlineActivity;

  /** The unique identifier for this player * */
  private readonly _id: string;

  /** The player's username, which is not guaranteed to be unique within the town * */
  private readonly _userName: string;

  /** The current ConversationArea that the player is in, or undefined if they are not located within one */
  private _activeConversationArea?: ServerConversationArea;

  constructor(userName: string) {
    this.isOnline = {
      moving: false,
    };
    this._userName = userName;
    this._id = nanoid();
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get activeConversationArea(): ServerConversationArea | undefined {
    return this._activeConversationArea;
  }

  set activeConversationArea(conversationArea: ServerConversationArea | undefined) {
    this._activeConversationArea = conversationArea;
  }

  /**
   * Represents the function that takes in online activity of the user and if yes, allows the player
   * to interact with the list of players that are online and send the friend request to any of them
   * online and present in the town activity based on the player's choice
   */

}

