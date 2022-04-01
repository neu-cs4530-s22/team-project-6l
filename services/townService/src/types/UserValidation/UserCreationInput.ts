import { InputType, Field } from 'type-graphql';
import Avatar from '../Avatar';

/** Contains the necessary data to create a user */
@InputType({ description: 'Contains the necessary data to create a user' })
export default class UserCreationInput {
  /** The unique string identifier for this user */
  @Field({ description: "The new user's username" })
  username!: string;

  /** The non-unique display name that is shown when connected to a town */
  @Field({ description: 'Name to be displayed in the frontend' })
  displayName!: string;

  /** The email to be registered with */
  @Field({ description: 'Email that is registered to user' })
  email!: string;

  @Field(() => Avatar, { description: 'The selected avatar' })
  avatar!: Avatar;
}