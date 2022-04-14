import { Type } from '@mikro-orm/core';
import InvitationMessage from './InvitationMessage';
import InvitationType from './InvitationType';

export default class InvitationMessageType extends Type<InvitationMessage | undefined, string | undefined> {
  convertToDatabaseValue(value: InvitationMessage | undefined): string | undefined {
    if (!value) {
      this.compareAsType();
      return value;
    }

    return `invitation(${value.from} ${value.fromEmail} ${value.to} ${value.toEmail} ${value.message} ${value.invitationType})`;
  }

  convertToJSValue(value: string | undefined): InvitationMessage | undefined {
    this.compareAsType();
    const m = value?.match(/invitation\(([A - z]\w +)([A - z]\w +)([A - z]\w +)([A - z]\w +)([A - z]\w +)([A - z]\w +) \)/i);

    if (!m) {
      return undefined;
    }

    return new InvitationMessage(m[1], m[3], m[5], m[7], m[9], m[11] as unknown as InvitationType);
  }

  convertToJSValueSQL(key: string): string {
    this.compareAsType();
    return `ST_AsText(${key})`;
  }

  convertToDatabaseValueSQL(key: string): string {
    this.compareAsType();
    return `ST_InvitationFromText(${key})`;
  }

  getColumnType(): string {
    this.compareAsType();
    return 'Invitation';
  }

}