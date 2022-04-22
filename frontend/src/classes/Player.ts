import { Avatar, InvitationMessage } from '../generated/graphql';

export type PlayerListener = {
  onInvitationsChange?: (newInvitations: InvitationMessage[]) => void;
  onFriendsChange?: (newFriends: FriendProfile[]) => void;
};

export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  private _friends: FriendProfile[];

  private _invitations: InvitationMessage[];

  private _listeners: PlayerListener[] = [];

  private readonly _avatar: Avatar;

  private readonly _email: string;

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  constructor(
    id: string,
    userName: string,
    location: UserLocation,
    avatar: Avatar,
    friends: FriendProfile[],
    invitations: InvitationMessage[],
    email: string,
  ) {
    this._id = id;
    this._userName = userName;
    this._avatar = avatar;
    this.location = location;
    this._friends = friends;
    this._invitations = invitations;
    this._email = email;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get avatar(): Avatar {
    return this._avatar;
  }

  get friends(): FriendProfile[] {
    return this._friends;
  }

  get invitations(): InvitationMessage[] {
    return this._invitations;
  }

  get email(): string {
    return this._email;
  }

  /**
   * Add player listener
   * @param listener listener to add
   */
  addListener(listener: PlayerListener) {
    this._listeners.push(listener);
  }

  /**
   * Remove player listener
   * @param listener listener to remove
   */
  removeListener(listener: PlayerListener) {
    this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
  }

  /**
   * Adds a new friend to the player
   * @param friend the new friend's profile
   */
  addFriend(friend: FriendProfile): void {
    this._friends.push(friend);
    this._listeners.forEach(listener => listener.onFriendsChange?.(this._friends));
  }

  /**
   * Update the player's friends
   * @param friends udpated list of friends
   */
  updateFriends(friends: FriendProfile[]): void {
    this._friends = friends;
    this._listeners.forEach(listener => listener.onFriendsChange?.(this._friends));
  }

  /**
   * Delete pending invitation from user with given username
   * @param from username of sender of pending invitation
   */
  deleteInvitationFrom(from: string): void {
    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
  }

  /**
   * Get the friend profile of a player
   * @param player player
   * @returns friend profile of given player
   */
  static toFriendProfile(player: Player): FriendProfile {
    return {
      _userName: player._userName,
      _avatar: player._avatar,
      _email: player._email,
    };
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(
      playerFromServer._id,
      playerFromServer._userName,
      playerFromServer.location,
      playerFromServer._avatar,
      playerFromServer._friends.map(sp => ({
        _userName: sp._userName,
        _avatar: sp._avatar,
        _email: sp._email,
      })),
      playerFromServer._invitations,
      playerFromServer._email,
    );
  }
}
export type ServerPlayer = {
  _id: string;
  _userName: string;
  location: UserLocation;
  _avatar: Avatar;
  _email: string;
  _friends: ServerPlayer[];
  _invitations: InvitationMessage[];
};

export type FriendProfile = {
  _userName: string;
  _avatar: Avatar;
  _email: string;
};

export type Direction = 'front' | 'back' | 'left' | 'right';

export type UserLocation = {
  x: number;
  y: number;
  rotation: Direction;
  moving: boolean;
  conversationLabel?: string;
};
