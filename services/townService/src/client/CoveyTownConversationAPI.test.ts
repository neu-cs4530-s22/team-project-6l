import { Collection } from '@mikro-orm/core';
import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { mock, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import CoveyTownController from '../lib/CoveyTownController';
import CoveyTownsStore from '../lib/CoveyTownsStore';
import DatabaseContext from '../lib/DatabaseContext';
import * as requestHandlers from '../requestHandlers/CoveyTownRequestHandlers';
import addTownRoutes from '../router/towns';
import Avatar from '../types/Avatar';
import InvitationMessage from '../types/InvitationMessage';
import User from '../types/User';
import { createConversationForTesting } from './TestUtils';
import TownsServiceClient, { ServerConversationArea } from './TownsServiceClient';

type TestTownData = {
  friendlyName: string;
  coveyTownID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

describe('Create Conversation Area API', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;
  const mockCoveyTownDatabase = mock<DatabaseContext>();

  async function createTownForTesting(
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await apiClient.createTown({
      friendlyName,
      isPubliclyListed: isPublic,
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      coveyTownID: ret.coveyTownID,
      townUpdatePassword: ret.coveyTownPassword,
    };
  }

  beforeAll(async () => {
    // Set up a spy for CoveyTownsStore that will always return our mockCoveyTownsStore as the singleton instance
    jest.spyOn(CoveyTownsStore, 'getDatabase').mockReturnValue(mockCoveyTownDatabase);

    mockCoveyTownDatabase.getUser.mockReturnValue(
      Promise.resolve({
        _id: 999,
        username: nanoid(),
        email: nanoid(),
        displayName: nanoid(),
        avatar: Avatar.Dog,
        createdAt: new Date(Date.now()),
        lastOnline: new Date(Date.now()),
        friends: new Collection<User>(this),
        invitations: new Collection<InvitationMessage>(this),
      }),
    );

    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addTownRoutes(server, app);
    await server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  beforeEach(() => {
    mockReset(mockCoveyTownDatabase);
  });
  afterAll(async () => {
    await server.close();
  });
  it('Executes without error when creating a new conversation', async () => {
    const testingTown = await createTownForTesting(undefined, true);
    const testingSession = await apiClient.joinTown({
      userName: nanoid(),
      coveyTownID: testingTown.coveyTownID,
      email: nanoid(),
      avatar: Avatar.Dog,
    });
    await apiClient.createConversationArea({
      conversationArea: createConversationForTesting(),
      coveyTownID: testingTown.coveyTownID,
      sessionToken: testingSession.coveySessionToken,
    });
  });
});
describe('conversationAreaCreateHandler', () => {
  const mockCoveyTownStore = mock<CoveyTownsStore>();
  const mockCoveyTownController = mock<CoveyTownController>();
  beforeAll(() => {
    // Set up a spy for CoveyTownsStore that will always return our mockCoveyTownsStore as the singleton instance
    jest.spyOn(CoveyTownsStore, 'getInstance').mockReturnValue(mockCoveyTownStore);
  });
  beforeEach(() => {
    // Reset all mock calls, and ensure that getControllerForTown will always return the same mock controller
    mockReset(mockCoveyTownController);
    mockReset(mockCoveyTownStore);
    mockCoveyTownStore.getControllerForTown.mockReturnValue(mockCoveyTownController);
  });
  it('Checks for a valid session token before creating a conversation area', () => {
    const coveyTownID = nanoid();
    const conversationArea: ServerConversationArea = {
      boundingBox: { height: 1, width: 1, x: 1, y: 1 },
      label: nanoid(),
      occupantsByID: [],
      topic: nanoid(),
    };
    const invalidSessionToken = nanoid();

    // Make sure to return 'undefined' regardless of what session token is passed
    mockCoveyTownController.getSessionByToken.mockReturnValueOnce(undefined);

    requestHandlers.conversationAreaCreateHandler({
      conversationArea,
      coveyTownID,
      sessionToken: invalidSessionToken,
    });
    expect(mockCoveyTownController.getSessionByToken).toBeCalledWith(invalidSessionToken);
    expect(mockCoveyTownController.addConversationArea).not.toHaveBeenCalled();
  });
});
