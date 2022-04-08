export enum InvitationType {
  Friend,
  TownJoin,
}
export default class InvitationMessage {
  private readonly _from: string;

  private readonly _to: string;

  private readonly _message: string | undefined;

  private readonly _type: InvitationType;

  constructor(from: string, to: string, type: InvitationType, message?: string) {
    this._from = from;
    this._to = to;
    this._type = type;
    this._message = message;
  }

  get from(): string {
    return this._from;
  }

  get to(): string {
    return this._to;
  }

  get type(): InvitationType {
    return this._type;
  }

  get message(): string | undefined {
    return this._message;
  }
}
