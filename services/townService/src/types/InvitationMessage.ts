import { Field, ObjectType } from 'type-graphql';
import InvitationType from './InvitationType';

@ObjectType()
export default class InvitationMessage {
  @Field(() => String, { description: 'Friend display name of recipient' })
  from!: string;

  @Field(() => String, { description: 'Recipient email' })
  fromEmail!: string;

  @Field(() => String, { description: 'Friend display name of receiver' })
  to!: string;

  @Field(() => String, { description: 'Receiver email' })
  toEmail!: string;

  @Field(() => String, { description: 'Message to display the receiver of invitation' })
  message!: string;

  @Field(() => InvitationType, { description: 'Type of invitation' })
  invitationType!: InvitationType;

  constructor(from: string, fromEmail: string, to: string, toEmail: string, message: string, invitationType: InvitationType) {
    this.from = from;
    this.fromEmail = fromEmail;
    this.to = to;
    this.toEmail = toEmail;
    this.message = message;
    this.invitationType = invitationType;
  }
}

