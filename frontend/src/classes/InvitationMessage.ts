export enum InvitationType {
  Friend,
  TownJoin,
}
export default class InvitationMessage {
  private readonly _from: string;

  private readonly _to: string;

  private readonly _fromEmail: string;

  private readonly _toEmail: string;

  private readonly _message: string | undefined;

  private readonly _type: InvitationType;

  constructor(
    from: string,
    fromEmail: string,
    to: string,
    toEmail: string,
    type: InvitationType,
    message?: string,
  ) {
    this._from = from;
    this._to = to;
    this._type = type;
    this._message = message;
    this._fromEmail = fromEmail;
    this._toEmail = toEmail;
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

  get fromEmail(): string {
    return this._fromEmail;
  }

  get toEmail(): string {
    return this._toEmail;
  }
}
