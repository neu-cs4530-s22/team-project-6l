import { Field, ObjectType } from 'type-graphql';
import User from '../User';
import FieldError from './FieldError';

/**
 * A class that contains a {@link User} if no errors were encounted. Otherwise, it contains a list
 * of {@link FieldError}s alongside the user as null.
 */
@ObjectType({
  description:
    'If no errors, returns the user. Otherwise, return the error alongside null for user',
})
export default class UserResponse {
  /** A list of {@link FieldError}s */
  @Field(() => [FieldError], { description: 'A list of FieldErrors', nullable: true })
  errors?: FieldError[];

  /** The resulting {@link User} */
  @Field(() => User, {
    description: 'The resulting user if no errors were returned',
    nullable: true,
  })
  user?: User;
}
