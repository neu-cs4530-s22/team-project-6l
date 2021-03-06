import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import Avatar from '../types/Avatar';
import InvitationMessage from '../types/InvitationMessage';
import InvitationType from '../types/InvitationType';
import { MyContext } from '../types/MyContext';
import User from '../types/User';
import UserCreationInput from '../types/UserValidation/UserCreationInput';
import UserResponse from '../types/UserValidation/UserResponse';

@Resolver()
export default class UsersResolver {
  private request = 'empty';

  /**
   * Gets all the users.
   * @returns
   */
  @Query(() => [User], { description: 'Get all users' })
  async users(@Ctx() { em }: MyContext): Promise<User[]> {
    this.request = 'users';
    const user = await em.find(User, {}, { populate: ['friends', 'invitations'] });
    return user;
  }

  /**
   * Gets a single user given a username.
   * @param username
   * @returns User
   */
  @Query(() => User, { description: 'Get a user with a given username', nullable: true })
  async user(
    @Arg('username', () => String) username: string,
      @Ctx() { em }: MyContext,
  ): Promise<User | null> {
    this.request = 'user';
    const user = await em.findOne(User, { username }, { populate: ['friends', 'invitations'] });
    return user;
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
      @Ctx() { em }: MyContext,
  ): Promise<UserResponse> {
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

    const userEmailFound = await em.findOne(User, { email });

    if (userEmailFound) {
      return {
        errors: [
          {
            field: 'email',
            message: 'User with email is already registered.',
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
          errors: [
            {
              field: 'username',
              message: 'Username has already been taken.',
            },
          ],
        };
      }

      return {
        errors: [
          {
            field: 'unknown',
            message: error.message,
          },
        ],
      };
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse, {
    description: 'Send friend invitation to another user',
    nullable: true,
  })
  async sendFriendInvitation(
    @Arg('from', () => String) from: string,
      @Arg('to', () => String) to: string,
      @Arg('message', () => String) message: string,
      @Ctx() { em }: MyContext,
  ): Promise<UserResponse | null> {
    this.request = 'friendInvitation';

    // toUser and fromUser are managed entities
    const fromUser = await em.findOneOrFail(User, { username: from });
    const toUser = await em.findOneOrFail(User, { username: to }, { populate: ['invitations'] });
    const existingInvitation = await toUser.invitations
      .getItems()
      .find(invitation => invitation.fromEmail === fromUser.email);
    // const doesInvitationExist = toUser?.invitations.contains(invitation);
    //   console.log(doesInvitationExist);

    // Make sure we are not adding a duplicate invitation
    // or that the two users are currently not friends
    try {
      if (!existingInvitation) {
        const invitation = em.create(InvitationMessage, {
          to: toUser,
          from: fromUser.displayName,
          fromEmail: fromUser.email,
          message,
          invitationType: InvitationType.Friend,
        });
        toUser.invitations.add(invitation);
        await em.persistAndFlush(toUser);

        return {
          user: toUser,
        };
      }

      return {
        errors: [
          {
            field: 'fromUser',
            message: 'Recepient already has an invitation from sender',
          },
        ],
      };
    } catch (err) {
      const error = err as Error;
      return {
        errors: [
          {
            field: 'unknown',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean, { description: 'Delete pending invitation' })
  async deleteFriendInvitation(
    @Arg('from', () => String) from: string,
      @Arg('to', () => String) to: string,
      @Ctx() { em }: MyContext,
  ): Promise<boolean> {
    this.request = 'delete';

    try {
      // some calls to this endpoint use the user's numerical id instead of username
      const filter = Number(to) ? { _id: parseInt(to, 10) } : { username: to };

      const toUser = await em.findOneOrFail(User, filter, { populate: ['invitations'] });
      const selectedInvitation = toUser.invitations.getItems().find(i => i.fromEmail === from);

      if (selectedInvitation) {
        toUser.invitations.remove(selectedInvitation);
      } else {
        return false;
      }

      await em.persistAndFlush(toUser);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Update a user's avatar or friend list. The avatar and friend parameters are optional,
   * which give ability to selectively update fields.
   * @param username
   * @param [avatar]
   * @param [friend]
   * @returns
   */
  @Mutation(() => UserResponse, {
    description: "Update a user's avatar and/or add a friend",
    nullable: true,
  })
  async update(
    @Arg('username', () => String) username: string,
      @Arg('avatar', () => Avatar, { nullable: true }) avatar: Avatar,
      @Arg('friend', () => String, { nullable: true }) friend: string,
      @Ctx() { em }: MyContext,
  ): Promise<UserResponse | null> {
    this.request = 'update';
    const user = await em.findOne(User, { username }, { populate: ['friends', 'friends.friends'] });
    const friendObject = await em.findOne(
      User,
      { username: friend },
      { populate: ['friends', 'friends.friends'] },
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: `The user ${username} does not exists`,
          },
        ],
      };
    }

    if (avatar) user.avatar = avatar;

    // Invariant: when we sent the friend request we know there are no duplicates
    // of invitation and have confirmed existence of user
    if (friendObject) {
      user.friends.add(friendObject);
      friendObject.friends.add(user);
    }

    await em.persistAndFlush([user, friendObject]);

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
      @Ctx() { em }: MyContext,
  ): Promise<boolean> {
    this.request = 'delete';
    try {
      await em.nativeDelete(User, { username });
      return true;
    } catch {
      return false;
    }
  }
}
