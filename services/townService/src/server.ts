import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import addTownRoutes from './router/towns';
import CoveyTownsStore from './lib/CoveyTownsStore';
import initDatabase from './database';
import UsersResolver from './resolvers/User';


const main = async () => {
  const orm = await initDatabase();

  const app = Express();
  app.use(CORS());
  const server = http.createServer(app);

  addTownRoutes(server, app);

  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UsersResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });


  await apollo.start();
  apollo.applyMiddleware({ app });

  server.listen(process.env.PORT || 8081, () => {
    const address = server.address() as AddressInfo;
    // eslint-disable-next-line no-console
    console.log(`Listening on ${address.port}`);
    if (process.env.DEMO_TOWN_ID) {
      CoveyTownsStore.getDatabase(orm);
      CoveyTownsStore.getInstance()
        .createTown(process.env.DEMO_TOWN_ID, false);
    }
  });
};

main();