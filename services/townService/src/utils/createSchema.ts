import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import UsersResolver from '../resolvers/User';

/**
 * Create the resolvers that determine the logic in a call
 * @returns the graphQL schema
 */
const createSchema = (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: [UsersResolver],
    validate: false,
  });

export default createSchema;
