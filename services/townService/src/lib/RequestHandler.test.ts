// Use of CORS ETC?
import CoveyTownsStore from './CoveyTownsStore';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import { ServerConversationArea } from '../client/TownsServiceClient';
import { ChatMessage } from '../CoveyTypes';
import { type } from 'os';
import { Client } from 'twilio/lib/twiml/VoiceResponse';

// Represents the information of the player that we are going to test our handlers with
export interface playerTestingInformation {
    // Represents the username of the player
    username: String, 
    // Represents the email of the player from the given database provided to test with
    email: String,
    // Represents the list of the friends of the player
    friends: [],


    // Represents the boolean instance 'onlineActivity' to check whether the given player is online or not
    // from the database
    onlineActivity: boolean

}

// Represents the class to test the functions or the handlers that work in coordination with the data
// base and the type given below represents the type of the player with the player information to use
// for the tests given below
export type playerToTest = {
    userId: String,
    username: String, 
    email: String,
    friends: []
    // The avatars given in the enum class in the code base (for more reference)
}

describe('Postgre Database Test', () => {
  
  let friendClient: dbClient;

  beforeAll(async () => {
  });

  afterAll(async () => {
  });
  describe('Postgre Database Test', () => {
    it('Represents the test of returning an empty list of friends if the player just joined and has no friends in the town yet', async () => {
      const firstPlayer: playerTestingInformation = {

      };

      await friendClient.addsPlayer({ username: firstPlayer.username });

      expect(await friendClient.getFriends({ email: '' })).toStrictEqual([]);
      await friendClient.deletesPlayer({ email: '' });
    });

    it('gets a list of friends if the player does not have friends right when the player joins the game', async () => {
      const firstUser: playerTestingInformation = {
    username: 'Madhur', 
    email: 'Madhur.prashant7@gmail.com',
    friends: [],
    onlineActivity: true
      };

      // ----- The friendClient only contains firstUser for now -----

      // Represents adding the user to the data base and checking for whether the user has no friends or not
      await friendClient.addsPlayer({user: firstUser})
      // Represents checking whether the given database contains friends for this user, should return an empty list of friends since the player just joined
      expect(await friendClient.FriendListHandler({username: firstUser.username})).toEqual([]);
    });
    it('gets a list of friends if the player has friends added to the list of friends for themselves', async () => {
        // Represents the player that is added for now to be used to check if they have friends or not
        const player1: playerTestingInformation = {
      username: 'Saul', 
      email: 'Saul@gmail.com',
      friends: [],
      onlineActivity: true
        };
                // Represents the second player that is added
                const friend1: playerTestingInformation = {
                    username: 'Mad', 
                    email: 'Mad@gmail.com',
                    friends: [],
                    onlineActivity: true
                      };
                // Represents the second player that is added
                const friend3: playerTestingInformation = {
                    username: 'Mad', 
                    email: 'Mad@gmail.com',
                    friends: [],
                    onlineActivity: true
                      };
                // Represents the second player that is added
                const friend2: playerTestingInformation = {
                    username: 'Victoria', 
                    email: 'Victoria@gmail.com',
                    friends: [],
                    onlineActivity: true
                      };
                // Represents the case of adding the player that is us to the data base and then adding the users to the 
                // player as its friends
                await friendClient.addsPlayer({user: player1});
                // Now that we have the player in the data base, we can add the other players to this player as their friends
                await friendClient.addsPlayer({user: friend1});
                await friendClient.addsPlayer({user: friend2});
                await friendClient.addsPlayer({user: friend3});

                // Represents adding them friend1 to the player1 as a friend
                await friendClient.friendIsAddedHandler({username: player1.username, 
                friendUserName: friend1.username});
                // Represents adding them friend2 to the player1 as a friend
                await friendClient.friendIsAddedHandler({username: player1.username, 
                friendUserName: friend2.username});

                // Represents the friends of the player for now
                let player1Friends : playerTestingInformation[] = await friendClient.FriendListHandler({username: player1.username});

                // Now that we have the friends of the player1, we can work on checking the list of the friends or the size
                // of the list of the friends : since there are three friends, we can check if the size of the friend list is 2, or
                // check if the friend list of the player1 contains the friends added
                expect(player1Friends.length).toStrictEqual(2);
                expect(player1Friends).toContain({                   
                username: 'Mad', 
                email: 'Mad@gmail.com',
                friends: [],
                onlineActivity: true});
                expect(player1Friends).toContain({                   
                    username: 'Victoria', 
                    email: 'Victoria@gmail.com',
                    friends: [],
                    onlineActivity: true});
                
                // --------------- X ------------------- X ------------------- X --------------------- X -------------
                // Represents the test to remove these friends and then check if the size of the 
                // friend list remains the same and that the list contains the friends or not, and in this case, 
                // it should not contain the friends added before since they are removed
                // --------------- X ------------------- X ------------------- X --------------------- X -------------
                
                // Represents unfriending friend1 and friend2 from player1's list of friends from before
                await friendClient.friendIsRemovedHandler({username: player1.username, 
                    friendUserName: friend1.username});
                await friendClient.friendIsRemovedHandler({username: player1.username, 
                    friendUserName: friend2.username});
                
                // Represents checking for if the list of friends still contain friend1, and friend2, that have been removed
                expect(player1Friends.length).toStrictEqual(0);
                expect(player1Friends).not.toContain({                   
                username: 'Mad', 
                email: 'Mad@gmail.com',
                friends: [],
                onlineActivity: true});
                expect(player1Friends).not.toContain({                   
                    username: 'Victoria', 
                    email: 'Victoria@gmail.com',
                    friends: [],
                    onlineActivity: true});
                
                // --------------- X ------------------- X ------------------- X --------------------- X -------------
                // Represents now that the friends are not there, to check if the data base still contains the users 
                // after they are added or deleted --> In the case of which when the users are added, return the database 
                // containing those users, else, tnhe database will not contain the users if they are removed
                // --------------- X ------------------- X ------------------- X --------------------- X -------------
                
                // Represents removing friend1 from the given friendClient database
                await friendClient.deletesPlayer({username: friend1.username});

                // Represents removing friend2 from the given friendClient database
                await friendClient.deletesPlayer({username: friend2.username});

                // Represents the test case to check whether the database still contains the friends or not after friend1 and friend2 have been removed
                expect(friendClient).not.toContain({username: friend1.username});
                expect(friendClient).not.toContain({username: friend2.username});
            });

        // Represents the 'it' block to test the case of when a friend or a player is added to the data base that is already
        // there, should either throw an error or show no change, else add them. Another case of this might include adding a player
        // as a friend who is already a friend or removing a player as a friend who was removed or not the users friend in teh first
        // place
        it('gets a list of friends if the player has friends added to the list that cannot be added or removed', async () => {
            // Represents the player that is added for now to be used to check if they have friends or not
            const player1: playerTestingInformation = {
          username: 'Saul', 
          email: 'Saul@gmail.com',
          friends: [],
          onlineActivity: true
            };
                    // Represents the second player that is added
                    const friend1: playerTestingInformation = {
                        username: 'Mad', 
                        email: 'Mad@gmail.com',
                        friends: [],
                        onlineActivity: true
                          };
                    // Represents the second player that is added
                    const friend3: playerTestingInformation = {
                        username: 'Mad', 
                        email: 'Mad@gmail.com',
                        friends: [],
                        onlineActivity: true
                          };
                    // Represents the second player that is added
                    const friend2: playerTestingInformation = {
                        username: 'Victoria', 
                        email: 'Victoria@gmail.com',
                        friends: [],
                        onlineActivity: true
                          };

                    
                    // Represents adding the player to the list of the player without them being in the database 
                    // itself

                    await friendClient.friendIsAddedHandler({username: friend2});
                    // Represents the list of friends to be returned as an empty list since the friend2 is not 
                    // added to the dataase before being added to the list of the friends of the player
                    expect(player1.friends).toStrictEqual([]);



                    // These are all of the tests for now - will be adding more (need to work on correcting/filling out some of the 
                    // logic of the backend friend connection and then using that to get the tests working)
  }
}