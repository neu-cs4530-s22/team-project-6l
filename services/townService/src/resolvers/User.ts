import { Collection, wrap } from "@mikro-orm/core";
import { Arg, Ctx, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Avatar, User } from "../entities/User";
import { MyContext } from "../types/MyContext";

@InputType()
class UserCreationInput {
  @Field()
  username!: string;
  @Field()
  displayName!: string;
  @Field()
  email!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg('username', () => String) username: string,
    @Ctx() { em }: MyContext): Promise<User | null> {
    return em.findOne(User, { username });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options', () => UserCreationInput) new_user: UserCreationInput,
    @Ctx() { em }: MyContext): Promise<UserResponse> {

    const { username, email, displayName } = new_user;

    if (username.length <= 3) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username length must be greater than 3'
          }
        ]
      };
    }
    if (displayName.length <= 3) {
      return {
        errors: [
          {
            field: 'displayName',
            message: 'Display name length must be greater than 3'
          }
        ]
      };
    }
    const user = em.create(User, { email: email, username: username, displayName: displayName });

    try {
      await em.persistAndFlush(user);
    }
    catch (err) {
      const error = err as Error;
      // duplicate username error
      if (error.code === '23505') {
        return {
          errors: [{
            field: 'username',
            message: 'Username has already been taken.'
          }]
        }
      }
    }

    return {
      user
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async update(
    @Arg('username', () => String) username: string,
    @Arg('avatar', () => Avatar, { nullable: true }) avatar: Avatar,
    @Arg('friend', () => String, { nullable: true }) friend: string,
    @Ctx() { em }: MyContext): Promise<UserResponse | null> {

    const user = await em.findOne(User, { username });
    const friendObject = await em.findOne(User, { username: friend }, { populate: ['friends'] });

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: `The user ${username} does not exists`
        }]
      };
    }

    if (avatar) user.avatar = avatar;
    // Add error handling for following cases (display informative errors):
    // 1. friend argument is empty
    // 2. could not find user with friend username
    if (friendObject) user.friends.add(friendObject);

    await em.persistAndFlush(user);

    return {
      user
    }
  }

  @Mutation(() => Boolean)
  async delete(
    @Arg("username", () => String) username: string,
    @Ctx() { em }: MyContext): Promise<boolean> {
    try {
      await em.nativeDelete(User, { username });
      return true;

    } catch {
      return false;
    }
  }
} 