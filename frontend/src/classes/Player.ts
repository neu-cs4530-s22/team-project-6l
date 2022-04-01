export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  private readonly _friends: Player[];

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  constructor(id: string, userName: string, location: UserLocation, friends: Player[]) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this._friends = friends;
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
      new Player('123', 'annie', mockLocation, []),
      new Player('234', 'bob', mockLocation, []),
    ];
    return new Player(
      playerFromServer._id,
      playerFromServer._userName,
      playerFromServer.location,
      mockFrineds,
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
