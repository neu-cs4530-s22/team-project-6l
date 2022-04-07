import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import User from '../types/User';
import Avatar from '../types/Avatar';
import { MyContext } from '../types/MyContext';
import UserCreationInput from '../types/UserValidation/UserCreationInput';
import UserResponse from '../types/UserValidation/UserResponse';

@Resolver()
export default class UsersResolver {

  private request = 'empty'; // TODO: ESLint hack to supress class-methods-use-this error.

  /**
   * Gets all the users.
   * @returns 
   */
  @Query(() => [User], { description: 'Get all users' })
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    this.request = 'users';
    return em.find(User, {});
  }

  /**
   * Gets a single user given a username.
   * @param username 
   * @returns User
   */
  @Query(() => User, { description: 'Get a user with a given username', nullable: true })
  user(
    @Arg('username', () => String) username: string,
      @Ctx() { em }: MyContext): Promise<User | null> {
    this.request = 'user';
    return em.findOne(User, { username });
  }

  /**
   * Creates a new user. Will return errors if the username/display name length
   * are less than 3 characters or if a username is already taken.
   * @param new_user 
   * @returns 
   */
  @Mutation(() => UserResponse, { description: 'Create a new user' })
  async register(
    @Arg('options', () => UserCreationInput) new_user: UserCreationInput,
      @Ctx() { em }: MyContext): Promise<UserResponse> {
    this.request = 'register';
    const { username, email, displayName, avatar } = new_user;

    if (username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username length must be greater than 3',
          },
        ],
      };
    }
    if (displayName.length <= 2) {
      return {
        errors: [
          {
            field: 'displayName',
            message: 'Display name length must be greater than 3',
          },
        ],
      };
    }
    const user = em.create(User, { email, username, displayName, avatar });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      const error = err as Error;
      // duplicate username error
      if (error.code === '23505') {
        return {
          errors: [{
            field: 'username',
            message: 'Username has already been taken.',
          }],
        };
      }

      return {
        errors: [{
          field: 'unknown',
          message: error.message,
        }],
      };

    }

    return {
      user,
    };
  }

  /**
   * Update a user's avatar or friend list. The avatar and friend parameters are optional, 
   * which give ability to selectively update fields. 
   * @param username 
   * @param [avatar]
   * @param [friend]
   * @returns 
   */
  @Mutation(() => UserResponse, { description: "Update a user's avatar and/or add a friend", nullable: true })
  async update(
    @Arg('username', () => String) username: string,
      @Arg('avatar', () => Avatar, { nullable: true }) avatar: Avatar,
      @Arg('friend', () => String, { nullable: true }) friend: string,
      @Ctx() { em }: MyContext): Promise<UserResponse | null> {

    this.request = 'update';
    const user = await em.findOne(User, { username });
    const friendObject = await em.findOne(User, { username: friend }, { populate: ['friends'] });

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: `The user ${username} does not exists`,
        }],
      };
    }

    if (avatar) user.avatar = avatar;
    // Add error handling for following cases (display informative errors):
    // 1. friend argument is empty
    // 2. could not find user with friend username
    if (friendObject) user.friends.add(friendObject);

    await em.persistAndFlush(user);

    return {
      user,
    };
  }

  /**
   * Deletes a user given a username.
   * @param username 
   * @returns 
   */
  @Mutation(() => Boolean, { description: 'Delete a user' })
  async delete(
    @Arg('username', () => String) username: string,
      @Ctx() { em }: MyContext): Promise<boolean> {
    this.request = 'delete';
    try {
      await em.nativeDelete(User, { username });
      return true;

    } catch {
      return false;
    }
  }


} 