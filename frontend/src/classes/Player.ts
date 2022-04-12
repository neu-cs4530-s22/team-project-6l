import { Avatar } from "generated/graphql";

export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  private readonly _avatar: Avatar;

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  constructor(id: string, userName: string, location: UserLocation, avatar: Avatar) {
    this._id = id;
    this._userName = userName;
    this._avatar = avatar;
    this.location = location;
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

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    const playerToReturn = new Player(playerFromServer._id, playerFromServer._userName, playerFromServer.location, playerFromServer._avatar);
    console.log(playerToReturn);
    return playerToReturn;
  }
}
export type ServerPlayer = { _id: string, _userName: string, location: UserLocation, _avatar: Avatar };

export type Direction = 'front' | 'back' | 'left' | 'right';

export type UserLocation = {
  x: number,
  y: number,
  rotation: Direction,
  moving: boolean,
  conversationLabel?: string
};
