import { ExecutionResult, graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'type-graphql';
import createSchema from '../utils/createSchema';

interface Options {
  source: string,
  variableValues?: Maybe<{
    [key: string]: unknown,
  }>;
  contextValue: unknown,
}

let schema: GraphQLSchema;

const gCall = async ({ source, variableValues, contextValue }: Options): Promise<ExecutionResult> => {
  if (!schema) {
    schema = await createSchema();
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};

export default gCall;