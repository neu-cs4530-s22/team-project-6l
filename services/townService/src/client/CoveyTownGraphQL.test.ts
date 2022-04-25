import { MikroORM } from '@mikro-orm/core';
import { faker } from '@mikro-orm/seeder';
import dotenv from 'dotenv';
import gCall from '../test-utils/gCall';
import testConn from '../test-utils/testConn';
import {
  addFriendMutation,
  deleteFriendInvitation,
  registerMutation,
  sendFriendInvitationMutation,
} from '../test-utils/typeDef';
import Avatar from '../types/Avatar';
import InvitationMessage from '../types/InvitationMessage';
import InvitationType from '../types/InvitationType';
import User from '../types/User';
import UserCreationInput from '../types/UserValidation/UserCreationInput';

dotenv.config();

const generateTestUser = () => {
  const username: string = faker.internet.email();
  return {
    username,
    displayName: faker.internet.userName(),
    email: username,
    avatar: Avatar.Dog,
  };
};

describe('Covey Town GraphQL API', () => {
  let db: MikroORM;

  beforeAll(async () => {
    db = await testConn();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('register', () => {
    let dbUser: User | null;

    const originalTestUser = generateTestUser();
    let testUser: UserCreationInput;

    beforeEach(() => {
      testUser = { ...originalTestUser };
    });
    afterEach(async () => {
      if (dbUser) await db.em.nativeDelete(User, { username: testUser.username });
    });

    it('register a valid user', async () => {
      const result = await gCall({
        source: registerMutation,
        variableValues: {
          options: testUser,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          register: {
            user: {
              email: testUser.email,
              username: testUser.username,
              avatar: Avatar.Dog,
              displayName: testUser.displayName,
            },
            errors: null,
          },
        },
      });

      dbUser = await db.em.findOne(User, { email: testUser.email });
      expect(dbUser).toBeDefined();
      expect(dbUser?.friends.getItems()).toEqual([]);
      expect(dbUser?.username).toBe(testUser.username);
      expect(dbUser?.displayName).toBe(testUser.displayName);
      expect(dbUser?.email).toBe(testUser.email);
    });

    it('throws error if given username is invalid length', async () => {
      testUser.username = 'a';

      const result = await gCall({
        source: registerMutation,
        variableValues: {
          options: testUser,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          register: {
            user: null,
            errors: [
              {
                field: 'username',
                message: 'Username length must be greater than 3',
              },
            ],
          },
        },
      });
    });

    it('throws error if display name is invalid length', async () => {
      testUser.displayName = 'a';
      const result = await gCall({
        source: registerMutation,
        variableValues: {
          options: testUser,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          register: {
            user: null,
            errors: [
              {
                field: 'displayName',
                message: 'Display name length must be greater than 3',
              },
            ],
          },
        },
      });
    });

    it('throws error if a user with same username already exists', async () => {
      const validRegister = await gCall({
        source: registerMutation,
        variableValues: {
          options: testUser,
        },
        contextValue: db,
      });

      expect(validRegister).toMatchObject({
        data: {
          register: {
            user: {
              email: testUser.email,
              username: testUser.username,
              avatar: Avatar.Dog,
              displayName: testUser.displayName,
            },
            errors: null,
          },
        },
      });

      dbUser = await db.em.findOneOrFail(User, { username: testUser.username });

      const result = await gCall({
        source: registerMutation,
        variableValues: {
          options: testUser,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          register: {
            user: null,
            errors: [
              {
                field: 'email',
                message: 'User with email is already registered.',
              },
            ],
          },
        },
      });
    });
  });
  describe('friend invitations', () => {
    let dbTo: User;
    let dbFrom: User;
    let dbInvitation: InvitationMessage | undefined;
    const toUser = generateTestUser();
    const fromUser = generateTestUser();

    beforeAll(async () => {
      // Register the users first
      await gCall({
        source: registerMutation,
        variableValues: {
          options: toUser,
        },
        contextValue: db,
      });

      dbTo = await db.em.findOneOrFail(
        User,
        { username: toUser.username },
        { populate: ['invitations'] },
      );

      await gCall({
        source: registerMutation,
        variableValues: {
          options: fromUser,
        },
        contextValue: db,
      });

      dbFrom = await db.em.findOneOrFail(User, { username: fromUser.username });
    });

    afterEach(async () => {
      if (dbInvitation) await db.em.nativeDelete(InvitationMessage, { _id: dbInvitation._id });
    });

    afterAll(async () => {
      await db.em.nativeDelete(User, { username: toUser.username });
      await db.em.nativeDelete(User, { username: fromUser.username });
    });

    it('successfully sent a friend invitation', async () => {
      const result = await gCall({
        source: sendFriendInvitationMutation,
        variableValues: {
          message: 'hello friend',
          from: fromUser.username,
          to: toUser.username,
        },
        contextValue: db,
      });

      dbInvitation = dbTo.invitations.getItems().find(i => i.fromEmail === fromUser.email);

      expect(result).toMatchObject({
        data: {
          sendFriendInvitation: {
            user: {
              invitations: [
                {
                  to: {
                    displayName: toUser.displayName,
                    username: toUser.username,
                  },
                  from: fromUser.displayName,
                  fromEmail: fromUser.email,
                  message: 'hello friend',
                  invitationType: InvitationType[0],
                },
              ],
            },
            errors: null,
          },
        },
      });

      expect(dbFrom.invitations.getItems()).toEqual([]);
      expect(dbTo.invitations.getItems()).toEqual([dbInvitation]);
    });
    it('throws error if the receipient already has invitation from sender', async () => {
      // initial invitation
      await gCall({
        source: sendFriendInvitationMutation,
        variableValues: {
          message: 'hello friend',
          from: fromUser.username,
          to: toUser.username,
        },
        contextValue: db,
      });

      dbInvitation = dbTo.invitations.getItems().find(i => i.fromEmail === fromUser.email);

      // send duplicate invitation
      const result = await gCall({
        source: sendFriendInvitationMutation,
        variableValues: {
          message: 'hello friend (duplicate)',
          from: fromUser.username,
          to: toUser.username,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          sendFriendInvitation: {
            user: null,
            errors: [
              {
                field: 'fromUser',
                message: 'Recepient already has an invitation from sender',
              },
            ],
          },
        },
      });

      expect(dbFrom.invitations.getItems()).toEqual([]);
      expect(dbTo.invitations.getItems()).toEqual([dbInvitation]);
    });

    it('deletes an invitation', async () => {
      // initial invitation
      await gCall({
        source: sendFriendInvitationMutation,
        variableValues: {
          message: 'hello friend',
          from: fromUser.username,
          to: toUser.username,
        },
        contextValue: db,
      });

      dbInvitation = dbTo.invitations.getItems().find(i => i.fromEmail === fromUser.email);

      // before DElETE call
      expect(dbTo.invitations.getItems()).toEqual([dbInvitation]);
      expect(dbFrom.invitations.getItems()).toEqual([]);

      const result = await gCall({
        source: deleteFriendInvitation,
        variableValues: {
          from: fromUser.username,
          to: toUser.username,
        },
        contextValue: db,
      });

      // after DELETE call
      expect(result).toMatchObject({
        data: {
          deleteFriendInvitation: true,
        },
      });
      expect(dbTo.invitations.getItems()).toEqual([]);
      expect(dbFrom.invitations.getItems()).toEqual([]);
    });
  });
  describe('add friend', () => {
    let dbUser: User;
    let dbFriend: User;
    const user = generateTestUser();
    const friend = generateTestUser();

    afterEach(async () => {
      await db.em.nativeDelete(User, { username: user.username });
      await db.em.nativeDelete(User, { username: friend.username });
    });

    it('adds a user to its friends list', async () => {
      // Register the users first
      await gCall({
        source: registerMutation,
        variableValues: {
          options: user,
        },
        contextValue: db,
      });

      dbUser = await db.em.findOneOrFail(User, { username: user.username });

      await gCall({
        source: registerMutation,
        variableValues: {
          options: friend,
        },
        contextValue: db,
      });

      dbFriend = await db.em.findOneOrFail(User, { username: friend.username });

      const result = await gCall({
        source: addFriendMutation,
        variableValues: {
          username: user.username,
          friend: friend.username,
        },
        contextValue: db,
      });

      expect(result).toMatchObject({
        data: {
          update: {
            user: {
              friends: [
                {
                  username: friend.username,
                  displayName: friend.displayName,
                },
              ],
            },
            errors: null,
          },
        },
      });

      expect(dbUser.friends.getItems()).toHaveLength(1);
      expect(dbFriend.friends.getItems()).toHaveLength(1);

      expect(dbUser.friends.getItems()).toEqual([dbFriend]);
      expect(dbFriend.friends.getItems()).toEqual([dbUser]);
    });

    it('throws error if the user does not exist', async () => {
      // only register the friend and not the user
      await gCall({
        source: registerMutation,
        variableValues: {
          options: friend,
        },
        contextValue: db,
      });

      dbFriend = await db.em.findOneOrFail(User, { username: friend.username });

      const result = await gCall({
        source: addFriendMutation,
        variableValues: {
          username: user.username,
          friend: friend.username,
        },
        contextValue: db,
      });
      expect(result).toMatchObject({
        data: {
          update: {
            user: null,
            errors: [
              {
                field: 'username',
                message: `The user ${user.username} does not exists`,
              },
            ],
          },
        },
      });

      expect(dbFriend.friends.getItems()).toEqual([]);
    });
  });
});
