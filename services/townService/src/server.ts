import { ApolloServer } from 'apollo-server-express';
import CORS from 'cors';
import Express from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';
import initDatabase from './database';
import CoveyTownsStore from './lib/CoveyTownsStore';
import addTownRoutes from './router/towns';
import createSchema from './utils/createSchema';

const main = async () => {
  const orm = await initDatabase();

  const app = Express();
  app.use(CORS());
  const server = http.createServer(app);
  addTownRoutes(server, app);

  const apollo = new ApolloServer({
    schema: await createSchema(),
    context: () => ({ em: orm.em }),
  });

  await apollo.start();
  apollo.applyMiddleware({ app });

  server.listen(process.env.PORT || 8081, () => {
    const address = server.address() as AddressInfo;
    // eslint-disable-next-line no-console
    console.log(`Listening on ${address.port}`);
    CoveyTownsStore.getDatabase(orm);
    if (process.env.DEMO_TOWN_ID) {
      CoveyTownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
    }
  });
};

main();
