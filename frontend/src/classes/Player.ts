import { Avatar, InvitationMessage } from '../generated/graphql';

export type PlayerListener = {
  onInvitationsChange?: (newInvitations: InvitationMessage[]) => void;
  onFriendsChange?: (newFriends: Player[]) => void;
};

export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  private _friends: Player[];

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
    friends: Player[],
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

  get friends(): Player[] {
    return this._friends;
  }

  get invitations(): InvitationMessage[] {
    return this._invitations;
  }

  get email(): string {
    return this._email;
  }

  addListener(listener: PlayerListener) {
    this._listeners.push(listener);
  }

  removeListener(listener: PlayerListener) {
    this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
  }

  addFriend(friend: Player): void {
    this._friends.push(friend);
    this._listeners.forEach(listener => listener.onFriendsChange?.(this._friends));
  }

  acceptTownJoinInvitationFrom(from: string): void {
    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
  }

  deleteInvitationFrom(from: string): void {
    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(
      playerFromServer._id,
      playerFromServer._userName,
      playerFromServer.location,
      playerFromServer._avatar,
      playerFromServer._friends.map(
        sp => new Player(sp._id, sp._userName, sp.location, sp._avatar, [], [], sp._email),
      ),
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

export type Direction = 'front' | 'back' | 'left' | 'right';

export type UserLocation = {
  x: number;
  y: number;
  rotation: Direction;
  moving: boolean;
  conversationLabel?: string;
};
