import { nanoid } from 'nanoid';
import InvitationMessage, { InvitationType } from './InvitationMessage';

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

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  constructor(
    id: string,
    userName: string,
    location: UserLocation,
    friends: Player[],
    invitations: InvitationMessage[],
  ) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this._friends = friends;
    this._invitations = invitations;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get friends(): Player[] {
    return this._friends;
  }

  get invitations(): InvitationMessage[] {
    return this._invitations;
  }

  addListener(listener: PlayerListener) {
    this._listeners.push(listener);
  }

  removeListener(listener: PlayerListener) {
    this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
  }

  acceptFriendInvitationFrom(from: string): void {
    // TODO: call backend to accept and delete friend invitation,
    // pass updated list of friends received from backend to listeners
    const mockDirection: Direction = 'front';
    const mockLocation = {
      x: 100,
      y: 100,
      rotation: mockDirection,
      moving: false,
      conversationLabel: undefined,
    };

    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
    this._friends.push(new Player(nanoid(), from, mockLocation, [this], []));
    this._listeners.forEach(listener => listener.onFriendsChange?.(this._friends));
  }

  acceptTownJoinInvitationFrom(from: string): void {
    // TODO: call backend to accept and delete town join invitation,
    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
  }

  rejectInvitationFrom(from: string): void {
    // TODO: call backend to reject and delete invitation
    this._invitations = this._invitations.filter(invitation => invitation.from !== from);
    this._listeners.forEach(listener => listener.onInvitationsChange?.(this._invitations));
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    // TODO: remove mock data once backend implementation is done
    const mockDirection: Direction = 'front';
    const mockLocation = {
      x: 100,
      y: 100,
      rotation: mockDirection,
      moving: false,
      conversationLabel: undefined,
    };
    const mockFrineds = [
      new Player('123', 'annie', mockLocation, [], []),
      new Player('234', 'bob', mockLocation, [], []),
    ];
    const mockInvitations = [
      new InvitationMessage(
        'charlie',
        playerFromServer._id,
        InvitationType.Friend,
        'Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!Join my network!',
      ),
      new InvitationMessage('dan', playerFromServer._id, InvitationType.TownJoin),
      new InvitationMessage('eli', playerFromServer._id, InvitationType.Friend, 'Be my frined!'),
      new InvitationMessage(
        'frank',
        playerFromServer._id,
        InvitationType.TownJoin,
        'Join my town!',
      ),
    ];
    return new Player(
      playerFromServer._id,
      playerFromServer._userName,
      playerFromServer.location,
      mockFrineds,
      mockInvitations,
    );
  }
}
export type ServerPlayer = { _id: string; _userName: string; location: UserLocation };

export type Direction = 'front' | 'back' | 'left' | 'right';

export type UserLocation = {
  x: number;
  y: number;
  rotation: Direction;
  moving: boolean;
  conversationLabel?: string;
};
