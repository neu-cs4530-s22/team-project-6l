import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import Avatar from './Avatar';
import InvitationMessage from './InvitationMessage';
import InvitationMessageType from './InvitationMessageType';
/**
 * Represents a {@link User}, along with a GraphQl schema and SQL table representation
 * using MikroORM and TypeGraphQl decorators.
 */
@ObjectType()
@Entity()
export default class User {
  [OptionalProps]?: 'lastOnline' | 'createdAt' | 'friendInvitations';

  /** Unique numerical identifier for user used in the database */
  @Field(() => ID, { description: 'Unique identifier for user' })
  @PrimaryKey()
  _id!: number;

  /** The user's unique username */
  @Field({ description: "The user's unique username" })
  @Property({ type: 'string' })
  @Unique()
  username!: string;

  /** Date which the user was created */
  @Field(() => String, { description: "The user's creation datetime" })
  @Property({ type: 'date' })
  createdAt = new Date();

  /** Date which the user was last seen online */
  @Field(() => String, { description: 'Time the user was last online' })
  @Property({ type: 'date', onUpdate: () => new Date() })
  lastOnline = new Date();

  /** Email associated with the user */
  @Field({ description: "The user's email" })
  @Property({ type: 'string' })
  email!: string;

  /** Display name that is shown in the frontend when user is connected to town */
  @Field({ description: 'The name to display when connected to a town' })
  @Property({ type: 'string' })
  displayName!: string;

  /** The {@link Avatar} containing the file path for the avatar image */
  @Field(() => Avatar, { description: 'Name of the file containting avatar image' })
  @Enum(() => Avatar)
  avatar!: Avatar;

  /** List of {@link User}s representing the user's friends */
  @Field(() => [User], { description: "List of the user's friends" })
  @ManyToMany(() => User)
  friends = new Collection<User>(this);

  @Field(() => [InvitationMessage], { description: 'List of pending invitations' })
  @OneToMany(() => InvitationMessageType, invitation => invitation)
  invitations = new Collection<InvitationMessage>(this);
}
