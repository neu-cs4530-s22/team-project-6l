import { Collection, Entity, Enum, ManyToMany, OptionalProps, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ID, InputType, ObjectType, registerEnumType } from "type-graphql";

export enum Avatar {
  AVATAR_1 = 'path1',
  AVATAR_2 = 'path2',
  AVATAR_3 = 'path3',
  AVATAR_4 = 'path4',
  AVATAR_5 = 'path5',
  AVATAR_6 = 'path6',
};

registerEnumType(Avatar, {
  name: 'Avatar',
  description: 'File name for avatar image'
})

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'lastOnline' | 'createdAt' | 'avatar';

  @Field(() => ID)
  @PrimaryKey()
  _id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  lastOnline = new Date();

  @Field()
  @Property({ type: 'string' })
  email!: string;

  @Field()
  @Property({ type: 'string' })
  @Unique()
  username!: string;

  @Field()
  @Property({ type: 'string' })
  displayName!: string;

  @Field(() => Avatar)
  @Enum(() => Avatar)
  avatar = Avatar.AVATAR_1;

  @Field(() => [User])
  @ManyToMany(() => User)
  friends = new Collection<User>(this);
}