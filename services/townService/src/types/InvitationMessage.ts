import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import InvitationType from './InvitationType';
// eslint-disable-next-line import/no-cycle
import User from './User';

@ObjectType()
@Entity()
export default class InvitationMessage {

  @Field(() => User, { description: 'User that is sending the invitation' })
  @ManyToOne(() => User, { primary: true })
  to!: User;

  @Field(() => String, { description: 'Friendly display name of invitation sender' })
  @Property({ type: 'string' })
  from!: string;

  @Field(() => String, { description: 'Email of the invitation sender' })
  @Property({ type: 'string' })
  fromEmail!: string;

  @Field(() => String, { description: 'Message to display the receiver of invitation' })
  @Property({ type: 'string', default: '' })
  message!: string;

  @Field(() => InvitationType, { description: 'Type of invitation' })
  @Enum(() => InvitationType)
  invitationType!: InvitationType;
}

